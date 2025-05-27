"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Search, Filter, Download, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { SalaryRecordForm } from "@/components/salaries/salary-record-form";
import { useToast } from "@/components/ui/use-toast";

interface SalaryRecord {
  id: string;
  employeeId: string;
  employee: {
    id: string;
    name: string;
    employeeId: string;
    position: string;
  };
  month: number;
  year: number;
  basicSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  createdAt: string;
  updatedAt: string;
}

export default function SalariesPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SalaryRecord | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  // Fetch salary records
  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedMonth) params.append('month', selectedMonth.toString());
      if (selectedYear) params.append('year', selectedYear.toString());
      
      const response = await fetch(`/api/salaries?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch salary records");
      }
      
      const data = await response.json();
      setRecords(data.data);
    } catch (error) {
      console.error("Error fetching salary records:", error);
      toast({
        title: "Error",
        description: "Failed to load salary records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle record deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this salary record?")) return;
    
    try {
      const response = await fetch(`/api/salaries?id=${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete record");
      }
      
      toast({
        title: "Success",
        description: "Salary record deleted successfully",
      });
      
      // Refresh the records
      fetchRecords();
    } catch (error) {
      console.error("Error deleting salary record:", error);
      toast({
        title: "Error",
        description: "Failed to delete salary record",
        variant: "destructive",
      });
    }
  };
  
  // Handle form submission success
  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
    fetchRecords();
  };
  
  // Handle edit action
  const handleEdit = (record: SalaryRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchRecords();
  }, [searchTerm, selectedMonth, selectedYear]);
  
  // Generate month and year options for filters
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salary Management</h1>
          <p className="text-muted-foreground">
            Manage employee salaries, bonuses, and deductions
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Salary Record
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Salary Records</CardTitle>
              <CardDescription>
                View and manage employee salary records
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search employees..."
                  className="w-full pl-8 sm:w-[200px] md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedMonth?.toString() || ""}
                onValueChange={(value) => setSelectedMonth(value ? parseInt(value) : null)}
              >
                <SelectTrigger className="w-[180px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Months</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedYear?.toString() || ""}
                onValueChange={(value) => setSelectedYear(value ? parseInt(value) : null)}
              >
                <SelectTrigger className="w-[120px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="ml-auto">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Basic Salary</TableHead>
                <TableHead className="text-right">Bonus</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Icons.spinner className="h-6 w-6 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No salary records found
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employee.name}</TableCell>
                    <TableCell>{record.employee.employeeId}</TableCell>
                    <TableCell>{record.employee.position || "-"}</TableCell>
                    <TableCell>
                      {new Date(record.year, record.month - 1).toLocaleString("default", {
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(record.basicSalary)}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.bonus ? formatCurrency(record.bonus) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.deductions ? formatCurrency(record.deductions) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(record.netSalary)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(record)}
                        >
                          <Icons.edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(record.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Icons.trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    {/* Salary Record Form Dialog */}
    <SalaryRecordForm
      isOpen={isFormOpen}
      onOpenChange={setIsFormOpen}
      record={editingRecord}
      onSubmit={handleFormSubmit}
    />
  </div>
  );
}
