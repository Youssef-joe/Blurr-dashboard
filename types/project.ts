export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold";
  startDate: Date;
  endDate: Date | null;
  managerId: string;
  teamMembers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProjectInput = Omit<
  Project,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateProjectInput = Partial<CreateProjectInput>;
