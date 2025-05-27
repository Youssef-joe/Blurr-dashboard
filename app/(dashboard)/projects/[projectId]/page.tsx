import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";

export default async function ProjectDetailPage({
  params,
}: {
  params: { projectId: string };
}) {
  const session = await auth();
  
  if (!session?.user) {
    return <div>Please sign in to view this project</div>;
  }

  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
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
  });

  if (!project) {
    notFound();
  }

  // Check if user has access to this project
  const hasAccess = 
    project.managerId === session.user.id || 
    JSON.parse(project.teamMembers as string).includes(session.user.id);
  
  if (!hasAccess) {
    return <div>You don&apos;t have access to this project</div>;
  }

  const teamMembers = JSON.parse(project.teamMembers as string) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-2">
            Project details and information
          </p>
        </div>
        
        {project.managerId === session.user.id && (
          <Button asChild>
            <Link href={`/projects/${project.id}/edit`}>Edit Project</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Overview of the project information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground">
                  {project.description || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium">Start Date</h3>
                  <p className="text-muted-foreground">
                    {format(new Date(project.startDate), "PPP")}
                  </p>
                </div>
                {project.endDate && (
                  <div className="space-y-1">
                    <h3 className="font-medium">End Date</h3>
                    <p className="text-muted-foreground">
                      {format(new Date(project.endDate), "PPP")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {project.manager?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-medium">{project.manager?.name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">
                    {project.manager?.email || "No email provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teamMembers.length > 0 ? (
                <div className="space-y-4">
                  {teamMembers.map((memberId: string) => (
                    <div key={memberId} className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                        {memberId[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {memberId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No team members added yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "active":
      return "default";
    case "completed":
      return "secondary"; // Changed from "success" to "secondary"
    case "on-hold":
      return "destructive"; // Changed from "warning" to "destructive"
    default:
      return "outline";
  }
}
