import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, MoreHorizontal, Download } from "lucide-react";

export default function EmployeesPage() {
  // Sample data for employees
  const employees = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      department: "Engineering",
      position: "Senior Developer",
      status: "Active",
      joined: "Jan 12, 2023",
      salary: "$95,000",
      avatar: "",
      initials: "AJ"
    },
    {
      id: "2",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      department: "Marketing",
      position: "Marketing Manager",
      status: "Active",
      joined: "Mar 15, 2022",
      salary: "$85,000",
      avatar: "",
      initials: "SC"
    },
    {
      id: "3",
      name: "Robert Taylor",
      email: "robert.taylor@example.com",
      department: "Sales",
      position: "Sales Representative",
      status: "Active",
      joined: "Jul 8, 2023",
      salary: "$72,000",
      avatar: "",
      initials: "RT"
    },
    {
      id: "4",
      name: "Jessica Kim",
      email: "jessica.kim@example.com",
      department: "HR",
      position: "HR Manager",
      status: "Active",
      joined: "Nov 20, 2021",
      salary: "$88,000",
      avatar: "",
      initials: "JK"
    },
    {
      id: "5",
      name: "Michael Torres",
      email: "michael.torres@example.com",
      department: "Engineering",
      position: "DevOps Engineer",
      status: "On Leave",
      joined: "Feb 3, 2022",
      salary: "$92,000",
      avatar: "",
      initials: "MT"
    },
    {
      id: "6",
      name: "Anna Martinez",
      email: "anna.martinez@example.com",
      department: "Design",
      position: "UI/UX Designer",
      status: "Active",
      joined: "Apr 17, 2023",
      salary: "$78,000",
      avatar: "",
      initials: "AM"
    },
    {
      id: "7",
      name: "David Wilson",
      email: "david.wilson@example.com",
      department: "Finance",
      position: "Financial Analyst",
      status: "Inactive",
      joined: "Sep 5, 2022",
      salary: "$82,000",
      avatar: "",
      initials: "DW"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Employee Directory</CardTitle>
            <CardDescription>
              Manage your company&apos;s employees and their information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search employees..."
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
                    <DropdownMenuItem>All Departments</DropdownMenuItem>
                    <DropdownMenuItem>Engineering</DropdownMenuItem>
                    <DropdownMenuItem>Marketing</DropdownMenuItem>
                    <DropdownMenuItem>Sales</DropdownMenuItem>
                    <DropdownMenuItem>HR</DropdownMenuItem>
                    <DropdownMenuItem>Finance</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            
            <div className="mt-4 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={employee.avatar}
                              alt={employee.name}
                            />
                            <AvatarFallback>{employee.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            employee.status === "Active"
                              ? "default"
                              : employee.status === "On Leave"
                              ? "outline"
                              : "secondary"
                          }
                          className={
                            employee.status === "Active"
                              ? "bg-green-500 hover:bg-green-500/90"
                              : employee.status === "On Leave"
                              ? "border-yellow-500 text-yellow-500"
                              : "bg-gray-500 hover:bg-gray-500/90"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.joined}</TableCell>
                      <TableCell>{employee.salary}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Employee</DropdownMenuItem>
                            <DropdownMenuItem>Salary History</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 flex items-center justify-end space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}