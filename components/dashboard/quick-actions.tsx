import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, FileSpreadsheet, Briefcase, ListTodo, DivideIcon as LucideIcon } from "lucide-react";

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

function QuickAction({ title, description, icon: Icon, href }: QuickActionProps) {
  return (
    <Link href={href} className="block">
      <div className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
}

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const actions = [
    {
      id: "1",
      title: "Add Employee",
      description: "Create a new employee profile",
      icon: UserPlus,
      href: "/employees/new",
    },
    {
      id: "2",
      title: "Generate Payroll",
      description: "Process monthly salary payments",
      icon: FileSpreadsheet,
      href: "/payroll/new",
    },
    {
      id: "3",
      title: "Create Project",
      description: "Set up a new project workspace",
      icon: Briefcase,
      href: "/projects/new",
    },
    {
      id: "4",
      title: "Assign Task",
      description: "Create and assign new tasks",
      icon: ListTodo,
      href: "/tasks/new",
    },
  ];

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>
          Perform common tasks quickly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => (
            <QuickAction
              key={action.id}
              title={action.title}
              description={action.description}
              icon={action.icon}
              href={action.href}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm">
            View All Actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}