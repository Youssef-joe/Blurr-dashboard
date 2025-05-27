import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../../components/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const session = await auth();
  
  if (!session?.user) {
    return <div>Please sign in to edit this project</div>;
  }

  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
  });

  if (!project) {
    notFound();
  }

  // Only the project manager can edit the project
  if (project.managerId !== session.user.id) {
    return <div>You don't have permission to edit this project</div>;
  }

  const handleSubmit = async (data: any) => {
    'use server';
    
    try {
      await prisma.project.update({
        where: { id: params.projectId },
        data: {
          ...data,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate ? data.endDate.toISOString() : null,
          teamMembers: JSON.stringify(data.teamMembers || []),
        },
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error("Failed to update project");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground mt-2">
          Update the project details below
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <ProjectForm 
          onSubmit={handleSubmit} 
          initialData={{
            ...project,
            startDate: new Date(project.startDate),
            endDate: project.endDate ? new Date(project.endDate) : null,
            teamMembers: JSON.parse(project.teamMembers as string) || [],
          }}
        />
      </div>
    </div>
  );
}
