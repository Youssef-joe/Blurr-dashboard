import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Project, User } from "@prisma/client";

type ProjectWithManager = Project & {
  manager: Pick<User, 'id' | 'name' | 'email' | 'image'>;
};

// Input validation schema
const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().default(""),
  status: z.enum(["active", "completed", "on-hold"]).default("active"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  managerId: z.string().min(1, "Manager ID is required"),
  teamMembers: z.array(z.string()).default([]),
});

// Helper function to format project response
const formatProjectResponse = (project: ProjectWithManager & { teamMembers: string }) => ({
  id: project.id,
  name: project.name,
  description: project.description,
  status: project.status,
  startDate: project.startDate.toISOString(),
  endDate: project.endDate?.toISOString() || null,
  managerId: project.managerId,
  teamMembers: JSON.parse(project.teamMembers) as string[],
  createdAt: project.createdAt.toISOString(),
  updatedAt: project.updatedAt.toISOString(),
  manager: project.manager,
});

/**
 * GET /api/projects
 * List all projects with pagination
 */
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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const [total, projects] = await Promise.all([
      prisma.project.count({
        where: {
          OR: [
            { managerId: session.user.id },
            { teamMembers: { contains: `"${session.user.id}"` } },
          ],
        },
      }),
      prisma.project.findMany({
        where: {
          OR: [
            { managerId: session.user.id },
            { teamMembers: { contains: `"${session.user.id}"` } },
          ],
        },
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }) as Promise<(Project & { teamMembers: string; manager: User })[]>,
    ]);

    return NextResponse.json({
      data: projects.map(formatProjectResponse),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch projects",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate input
    const validation = createProjectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    const { name, description, status, startDate, endDate, teamMembers, managerId } = validation.data;

    // Check if manager exists
    const manager = await prisma.user.findUnique({
      where: { id: managerId },
      select: { id: true, name: true, email: true, image: true },
    });

    if (!manager) {
      return NextResponse.json(
        { error: "Manager not found" },
        { status: 404 }
      );
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        status,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        managerId,
        teamMembers: JSON.stringify(teamMembers),
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }) as Project & { teamMembers: string; manager: User };

    return NextResponse.json({
      data: formatProjectResponse(project)
    }, { status: 201 });

  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    return NextResponse.json(
      { 
        error: "Failed to create project",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}
