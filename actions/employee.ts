"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { employeeSchema } from "@/lib/validations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createEmployee(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const data = {
    employeeId: formData.get("employeeId") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    joiningDate: new Date(formData.get("joiningDate") as string),
    basicSalary: parseFloat(formData.get("basicSalary") as string),
    isActive: formData.get("isActive") === "true",
  };

  const validatedData = employeeSchema.parse(data);

  const employee = await prisma.employee.create({
    data: {
      ...validatedData,
      userId: session.user.id,
    },
  });

  revalidatePath("/employees");
  return employee;
}

export async function updateEmployee(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const data = {
    employeeId: formData.get("employeeId") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    joiningDate: new Date(formData.get("joiningDate") as string),
    basicSalary: parseFloat(formData.get("basicSalary") as string),
    isActive: formData.get("isActive") === "true",
  };

  const validatedData = employeeSchema.parse(data);

  const employee = await prisma.employee.update({
    where: { id },
    data: validatedData,
  });

  revalidatePath("/employees");
  return employee;
}

export async function deleteEmployee(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.employee.delete({
    where: { id },
  });

  revalidatePath("/employees");
}

export async function getEmployees() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const employees = await prisma.employee.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return employees;
}

export async function getEmployee(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      tasks: true,
      salaryRecords: {
        orderBy: {
          year: "desc",
          month: "desc",
        },
      },
    },
  });

  if (!employee || employee.userId !== session.user.id) {
    throw new Error("Employee not found");
  }

  return employee;
}
