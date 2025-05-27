import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Input validation schemas
const createSalaryRecordSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  month: z.number().min(1).max(12, "Month must be between 1-12"),
  year: z.number().min(2000).max(2100, "Invalid year"),
  basicSalary: z.number().min(0, "Basic salary must be positive"),
  bonus: z.number().min(0, "Bonus cannot be negative").default(0),
  deductions: z.number().min(0, "Deductions cannot be negative").default(0),
});

const updateSalaryRecordSchema = createSalaryRecordSchema.partial().extend({
  id: z.string().min(1, "Record ID is required"),
});

// GET /api/salaries - Get salary records with pagination and filtering
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const employeeId = searchParams.get("employeeId");
    const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : null;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : null;

    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (month) where.month = month;
    if (year) where.year = year;

    const [records, total] = await Promise.all([
      prisma.salaryRecord.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
            },
          },
        },
        orderBy: { year: 'desc', month: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.salaryRecord.count({ where }),
    ]);

    return NextResponse.json({
      data: records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("[SALARIES_GET]", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        error: "Failed to fetch salary records",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      },
      { status: 500 }
    );
  }
}

// POST /api/salaries - Create a new salary record
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const data = createSalaryRecordSchema.parse({
      ...json,
      month: parseInt(json.month),
      year: parseInt(json.year),
      basicSalary: parseFloat(json.basicSalary),
      bonus: parseFloat(json.bonus || 0),
      deductions: parseFloat(json.deductions || 0),
    });

    // Check if record already exists for this employee and month/year
    const existingRecord = await prisma.salaryRecord.findFirst({
      where: {
        employeeId: data.employeeId,
        month: data.month,
        year: data.year,
      },
    });

    if (existingRecord) {
      return NextResponse.json(
        { error: "A salary record already exists for this employee and period" },
        { status: 400 }
      );
    }

    // Calculate net salary
    const netSalary = data.basicSalary + data.bonus - data.deductions;

    const record = await prisma.salaryRecord.create({
      data: {
        ...data,
        netSalary,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
          },
        },
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    console.error("[SALARIES_POST]", error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        error: "Failed to create salary record",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      },
      { status: 500 }
    );
  }
}

// PATCH /api/salaries - Update a salary record
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const { id, ...updateData } = updateSalaryRecordSchema.parse({
      ...json,
      month: json.month ? parseInt(json.month) : undefined,
      year: json.year ? parseInt(json.year) : undefined,
      basicSalary: json.basicSalary ? parseFloat(json.basicSalary) : undefined,
      bonus: json.bonus !== undefined ? parseFloat(json.bonus) : undefined,
      deductions: json.deductions !== undefined ? parseFloat(json.deductions) : undefined,
    });

    // Get current record
    const currentRecord = await prisma.salaryRecord.findUnique({
      where: { id },
    });

    if (!currentRecord) {
      return NextResponse.json(
        { error: "Salary record not found" },
        { status: 404 }
      );
    }

    // Check for duplicate records (same employee, month, year)
    if (updateData.employeeId || updateData.month || updateData.year) {
      const where: any = {
        id: { not: id },
        employeeId: updateData.employeeId || currentRecord.employeeId,
        month: updateData.month || currentRecord.month,
        year: updateData.year || currentRecord.year,
      };

      const existingRecord = await prisma.salaryRecord.findFirst({ where });
      if (existingRecord) {
        return NextResponse.json(
          { error: "A salary record already exists for this employee and period" },
          { status: 400 }
        );
      }
    }

    // Calculate net salary if any financial fields are updated
    let netSalary = currentRecord.netSalary;
    if (updateData.basicSalary !== undefined || 
        updateData.bonus !== undefined || 
        updateData.deductions !== undefined) {
      const basic = updateData.basicSalary ?? currentRecord.basicSalary;
      const bonus = updateData.bonus ?? currentRecord.bonus;
      const deductions = updateData.deductions ?? currentRecord.deductions;
      netSalary = basic + bonus - deductions;
    }

    const updatedRecord = await prisma.salaryRecord.update({
      where: { id },
      data: {
        ...updateData,
        netSalary,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
          },
        },
      },
    });

    return NextResponse.json(updatedRecord);
  } catch (error: any) {
    console.error("[SALARIES_PATCH]", error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        error: "Failed to update salary record",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/salaries - Delete a salary record
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Record ID is required" },
        { status: 400 }
      );
    }

    await prisma.salaryRecord.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[SALARIES_DELETE]", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        error: "Failed to delete salary record",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      },
      { status: 500 }
    );
  }
}
