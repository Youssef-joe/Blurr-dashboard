import { z } from "zod";

export const employeeSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional(),
  joiningDate: z.date(),
  basicSalary: z.number().positive("Basic salary must be positive"),
  isActive: z.boolean().default(true),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD", "CANCELLED"]),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  projectId: z.string().min(1, "Project ID is required"),
  assigneeId: z.string().optional(),
});

export const salaryRecordSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  basicSalary: z.number().positive(),
  bonus: z.number().min(0).default(0),
  deductions: z.number().min(0).default(0),
  employeeId: z.string().min(1, "Employee ID is required"),
});
