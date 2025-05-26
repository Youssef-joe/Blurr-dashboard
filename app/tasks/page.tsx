"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  Filter, 
  AlertCircle, 
  Clock, 
  MoreHorizontal 
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  project: string;
  assignee: {
    name: string;
    avatar: string;
    initials: string;
  };
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  count: number;
}

function TaskColumn({ title, tasks, count }: TaskColumnProps) {
  return (
    <div className="flex h-full min-h-[500px] w-full flex-col rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between border-b bg-muted/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          <Badge variant="secondary" className="rounded-full">
            {count}
          </Badge>
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add task</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="line-clamp-2 font-medium">{task.title}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Move to Todo</DropdownMenuItem>
                      <DropdownMenuItem>Move to In Progress</DropdownMenuItem>
                      <DropdownMenuItem>Move to Review</DropdownMenuItem>
                      <DropdownMenuItem>Move to Done</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {task.description}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge
                    variant="outline"
                    className={
                      task.priority === "High"
                        ? "border-red-500 text-red-500"
                        : task.priority === "Medium"
                        ? "border-yellow-500 text-yellow-500"
                        : "border-green-500 text-green-500"
                    }
                  >
                    {task.priority}
                  </Badge>
                  <Badge variant="secondary">{task.project}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{task.dueDate}</span>
                  </div>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                    />
                    <AvatarFallback className="text-[10px]">
                      {task.assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  // Sample data for tasks
  const todoTasks: Task[] = [
    {
      id: "1",
      title: "Update privacy policy",
      description: "Review and update the privacy policy to comply with new regulations",
      priority: "Medium",
      dueDate: "Jul 25",
      project: "Legal",
      assignee: {
        name: "Jessica Kim",
        avatar: "",
        initials: "JK"
      }
    },
    {
      id: "2",
      title: "Fix mobile navigation bug",
      description: "The mobile menu doesn't close when clicking outside",
      priority: "High",
      dueDate: "Jul 20",
      project: "Website",
      assignee: {
        name: "Alex Johnson",
        avatar: "",
        initials: "AJ"
      }
    },
    {
      id: "3",
      title: "Create onboarding email sequence",
      description: "Design and implement email sequence for new users",
      priority: "Medium",
      dueDate: "Jul 28",
      project: "Marketing",
      assignee: {
        name: "Sarah Chen",
        avatar: "",
        initials: "SC"
      }
    }
  ];

  const inProgressTasks: Task[] = [
    {
      id: "4",
      title: "Implement new dashboard charts",
      description: "Add sales and user growth charts to the dashboard",
      priority: "Medium",
      dueDate: "Jul 22",
      project: "Website",
      assignee: {
        name: "Michael Torres",
        avatar: "",
        initials: "MT"
      }
    },
    {
      id: "5",
      title: "Optimize database queries",
      description: "Improve performance of slow-running database queries",
      priority: "High",
      dueDate: "Jul 21",
      project: "Backend",
      assignee: {
        name: "Alex Johnson",
        avatar: "",
        initials: "AJ"
      }
    }
  ];

  const inReviewTasks: Task[] = [
    {
      id: "6",
      title: "Design new landing page",
      description: "Create mockups for the new product landing page",
      priority: "Medium",
      dueDate: "Jul 18",
      project: "Marketing",
      assignee: {
        name: "Anna Martinez",
        avatar: "",
        initials: "AM"
      }
    },
    {
      id: "7",
      title: "Write API documentation",
      description: "Document the new API endpoints for developers",
      priority: "Low",
      dueDate: "Jul 24",
      project: "Documentation",
      assignee: {
        name: "David Wilson",
        avatar: "",
        initials: "DW"
      }
    }
  ];

  const doneTasks: Task[] = [
    {
      id: "8",
      title: "Set up CI/CD pipeline",
      description: "Configure automated testing and deployment",
      priority: "High",
      dueDate: "Jul 15",
      project: "DevOps",
      assignee: {
        name: "Michael Torres",
        avatar: "",
        initials: "MT"
      }
    },
    {
      id: "9",
      title: "Create Q3 marketing plan",
      description: "Develop marketing strategy for Q3",
      priority: "Medium",
      dueDate: "Jul 10",
      project: "Marketing",
      assignee: {
        name: "Sarah Chen",
        avatar: "",
        initials: "SC"
      }
    },
    {
      id: "10",
      title: "Conduct user interviews",
      description: "Interview users about the new feature",
      priority: "Medium",
      dueDate: "Jul 12",
      project: "Research",
      assignee: {
        name: "Jessica Kim",
        avatar: "",
        initials: "JK"
      }
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
        
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Task Board</CardTitle>
                <CardDescription>
                  Manage and track project tasks
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search tasks..."
                    className="w-[200px] pl-8"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>All Tasks</DropdownMenuItem>
                    <DropdownMenuItem>My Tasks</DropdownMenuItem>
                    <DropdownMenuItem>High Priority</DropdownMenuItem>
                    <DropdownMenuItem>Due This Week</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TaskColumn
                title="Todo"
                tasks={todoTasks}
                count={todoTasks.length}
              />
              <TaskColumn
                title="In Progress"
                tasks={inProgressTasks}
                count={inProgressTasks.length}
              />
              <TaskColumn
                title="In Review"
                tasks={inReviewTasks}
                count={inReviewTasks.length}
              />
              <TaskColumn
                title="Done"
                tasks={doneTasks}
                count={doneTasks.length}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}