import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Clock, 
  Calendar, 
  Filter 
} from "lucide-react";

export default function ProjectsPage() {
  // Sample data for projects
  const projects = [
    {
      id: "1",
      title: "Website Redesign",
      description: "Redesign the company website with new branding and improved UX",
      progress: 75,
      status: "In Progress",
      dueDate: "July 30, 2025",
      department: "Engineering",
      team: [
        { name: "Alex Johnson", avatar: "", initials: "AJ" },
        { name: "Sarah Chen", avatar: "", initials: "SC" },
        { name: "Michael Torres", avatar: "", initials: "MT" }
      ],
      tasks: { completed: 15, total: 20 }
    },
    {
      id: "2",
      title: "Mobile App Development",
      description: "Develop a mobile app for both iOS and Android platforms",
      progress: 45,
      status: "In Progress",
      dueDate: "September 15, 2025",
      department: "Engineering",
      team: [
        { name: "Robert Taylor", avatar: "", initials: "RT" },
        { name: "Jessica Kim", avatar: "", initials: "JK" },
        { name: "David Wilson", avatar: "", initials: "DW" },
        { name: "Anna Martinez", avatar: "", initials: "AM" }
      ],
      tasks: { completed: 27, total: 60 }
    },
    {
      id: "3",
      title: "Q3 Marketing Campaign",
      description: "Plan and execute marketing campaign for Q3 product launch",
      progress: 30,
      status: "In Progress",
      dueDate: "August 1, 2025",
      department: "Marketing",
      team: [
        { name: "Sarah Chen", avatar: "", initials: "SC" },
        { name: "Anna Martinez", avatar: "", initials: "AM" }
      ],
      tasks: { completed: 6, total: 20 }
    },
    {
      id: "4",
      title: "Sales Training Program",
      description: "Develop and implement a new sales training program",
      progress: 90,
      status: "Almost Complete",
      dueDate: "June 25, 2025",
      department: "Sales",
      team: [
        { name: "Robert Taylor", avatar: "", initials: "RT" },
        { name: "Jessica Kim", avatar: "", initials: "JK" }
      ],
      tasks: { completed: 18, total: 20 }
    },
    {
      id: "5",
      title: "HR System Integration",
      description: "Integrate new HR management system with existing infrastructure",
      progress: 60,
      status: "In Progress",
      dueDate: "August 30, 2025",
      department: "HR",
      team: [
        { name: "Jessica Kim", avatar: "", initials: "JK" },
        { name: "Michael Torres", avatar: "", initials: "MT" },
        { name: "David Wilson", avatar: "", initials: "DW" }
      ],
      tasks: { completed: 12, total: 20 }
    },
    {
      id: "6",
      title: "Data Center Migration",
      description: "Migrate on-premises servers to cloud infrastructure",
      progress: 15,
      status: "Just Started",
      dueDate: "October 15, 2025",
      department: "IT",
      team: [
        { name: "Alex Johnson", avatar: "", initials: "AJ" },
        { name: "Michael Torres", avatar: "", initials: "MT" }
      ],
      tasks: { completed: 3, total: 20 }
    }
  ];

  // Function to determine badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Just Started":
        return "border-blue-500 text-blue-500";
      case "In Progress":
        return "border-yellow-500 text-yellow-500";
      case "Almost Complete":
        return "border-green-500 text-green-500";
      case "Completed":
        return "bg-green-500 hover:bg-green-500/90 text-white";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
        
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="w-full pl-8 md:w-[300px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Projects</DropdownMenuItem>
                <DropdownMenuItem>My Projects</DropdownMenuItem>
                <DropdownMenuItem>Active Projects</DropdownMenuItem>
                <DropdownMenuItem>Completed Projects</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              List View
            </Button>
            <Button size="sm">
              Card View
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>View Tasks</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        Archive Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-2">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>
                        {project.tasks.completed}/{project.tasks.total} tasks
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{project.dueDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <div className="flex w-full items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {project.department}
                  </div>
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, index) => (
                      <Avatar
                        key={index}
                        className="h-7 w-7 border-2 border-background"
                      >
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 3 && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}