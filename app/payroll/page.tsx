"use client";

import React, { useState } from "react";
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
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Download, FileText, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function PayrollPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Sample data for payroll
  const payrollData = [
    {
      id: "1",
      employee: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        avatar: "",
        initials: "AJ"
      },
      department: "Engineering",
      baseSalary: 7916.67, // $95,000 annually
      bonus: 500,
      deductions: 950,
      netSalary: 7466.67,
      status: "Processed"
    },
    {
      id: "2",
      employee: {
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        avatar: "",
        initials: "SC"
      },
      department: "Marketing",
      baseSalary: 7083.33, // $85,000 annually
      bonus: 0,
      deductions: 850,
      netSalary: 6233.33,
      status: "Processed"
    },
    {
      id: "3",
      employee: {
        name: "Robert Taylor",
        email: "robert.taylor@example.com",
        avatar: "",
        initials: "RT"
      },
      department: "Sales",
      baseSalary: 6000, // $72,000 annually
      bonus: 1200, // Commission
      deductions: 720,
      netSalary: 6480,
      status: "Processed"
    },
    {
      id: "4",
      employee: {
        name: "Jessica Kim",
        email: "jessica.kim@example.com",
        avatar: "",
        initials: "JK"
      },
      department: "HR",
      baseSalary: 7333.33, // $88,000 annually
      bonus: 0,
      deductions: 880,
      netSalary: 6453.33,
      status: "Pending"
    },
    {
      id: "5",
      employee: {
        name: "Michael Torres",
        email: "michael.torres@example.com",
        avatar: "",
        initials: "MT"
      },
      department: "Engineering",
      baseSalary: 7666.67, // $92,000 annually
      bonus: 0,
      deductions: 920, 
      netSalary: 6746.67,
      status: "Pending"
    },
  ];

  // Calculate total payroll
  const totalBaseSalary = payrollData.reduce((sum, item) => sum + item.baseSalary, 0);
  const totalBonus = payrollData.reduce((sum, item) => sum + item.bonus, 0);
  const totalDeductions = payrollData.reduce((sum, item) => sum + item.deductions, 0);
  const totalNetSalary = payrollData.reduce((sum, item) => sum + item.netSalary, 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal w-[240px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date > new Date() || date < new Date("2023-01-01")}
                />
              </PopoverContent>
            </Popover>
            <Button>Generate Payroll</Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Monthly Payroll</CardTitle>
            <CardDescription>
              Manage and process employee salaries for {date ? format(date, "MMMM yyyy") : "the current month"}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search employees..."
                  className="pl-8 w-[250px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Base Salary</TableHead>
                    <TableHead className="text-right">Bonus</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={item.employee.avatar}
                              alt={item.employee.name}
                            />
                            <AvatarFallback>{item.employee.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{item.employee.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.employee.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.baseSalary)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.bonus)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.deductions)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.netSalary)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            item.status === "Processed"
                              ? "border-green-500 text-green-500"
                              : "border-yellow-500 text-yellow-500"
                          )}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View slip</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Base Salary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{formatCurrency(totalBaseSalary)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Bonuses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{formatCurrency(totalBonus)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{formatCurrency(totalDeductions)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Net Salary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{formatCurrency(totalNetSalary)}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Process All Pending</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}