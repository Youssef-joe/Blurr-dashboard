import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../components/project-form";

export default async function NewProjectPage() {
  const session = await auth();

  if (!session?.user) {
    return <div>Please sign in to create a project</div>;
  }

  const handleSubmit = async (data: any) => {
    'use server';
    
    try {
      await prisma.project.create({
        data: {
          ...data,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate ? data.endDate.toISOString() : null,
          managerId: session.user.id,
          teamMembers: JSON.stringify(data.teamMembers || []),
        },
      });
      return { success: true };
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Failed to create project");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to create a new project
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <ProjectForm 
          onSubmit={handleSubmit} 
          initialData={{
            status: "active",
            startDate: new Date(),
            teamMembers: [],
          }}
        />
      </div>
    </div>
  );
}
