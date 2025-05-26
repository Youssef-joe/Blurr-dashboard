import { AIChat } from "@/components/ai-assistant/chat";
import { ProjectList } from "@/components/projects/project-list";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { managerId: session.user.id },
        { teamMembers: { has: session.user.id } },
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <ProjectList projects={projects} onProjectUpdate={() => {}} />
        </div>
        <AIChat />
      </div>
    </div>
  );
}
