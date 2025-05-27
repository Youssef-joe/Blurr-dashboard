import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function ProjectsPage() {
  const session = await auth();
  
  if (!session?.user) {
    return <div>Please sign in to view projects</div>;
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { managerId: session.user.id },
        { teamMembers: { contains: `"${session.user.id}"` } },
      ],
    },
    include: {
      manager: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your projects and track progress
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">New Project</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium">No projects yet</h3>
          <p className="text-muted-foreground mt-2">
            Get started by creating a new project
          </p>
          <Button className="mt-4" asChild>
            <Link href="/projects/new">Create Project</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <CardDescription>
                      Managed by {project.manager?.name || "Unknown"}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusVariant(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description || "No description provided"}
                </p>
                <div className="mt-4 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span>{format(new Date(project.startDate), "MMM d, yyyy")}</span>
                  </div>
                  {project.endDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End Date</span>
                      <span>{format(new Date(project.endDate), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/projects/${project.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "active":
      return "default";
    case "completed":
      return "success";
    case "on-hold":
      return "warning";
    default:
      return "outline";
  }
}
