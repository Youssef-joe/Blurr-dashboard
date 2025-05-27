"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  month: z.coerce.number().min(1).max(12, "Invalid month"),
  year: z.coerce.number().min(2000).max(2100, "Invalid year"),
  basicSalary: z.coerce.number().min(0, "Basic salary must be positive"),
  bonus: z.coerce.number().min(0, "Bonus cannot be negative").default(0),
  deductions: z.coerce.number().min(0, "Deductions cannot be negative").default(0),
});

type FormValues = z.infer<typeof formSchema>;

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  position: string;
}

interface SalaryRecordFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  record?: any;
  onSubmit: () => void;
}

export function SalaryRecordForm({
  isOpen,
  onOpenChange,
  record,
  onSubmit: onSuccess,
}: SalaryRecordFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      basicSalary: 0,
      bonus: 0,
      deductions: 0,
    },
  });

  // Fetch employees for the dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees");
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast({
          title: "Error",
          description: "Failed to load employees",
          variant: "destructive",
        });
      } finally {
        setIsEmployeeLoading(false);
      }
    };

    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen, toast]);

  // Set form values when editing
  useEffect(() => {
    if (record) {
      form.reset({
        employeeId: record.employeeId,
        month: record.month,
        year: record.year,
        basicSalary: record.basicSalary,
        bonus: record.bonus,
        deductions: record.deductions,
      });
    } else {
      form.reset({
        employeeId: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basicSalary: 0,
        bonus: 0,
        deductions: 0,
      });
    }
  }, [record, form, isOpen]);

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const url = record
        ? `/api/salaries?id=${record.id}`
        : "/api/salaries";
      const method = record ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to save record");
      }

      toast({
        title: "Success",
        description: record
          ? "Salary record updated successfully"
          : "Salary record created successfully",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving salary record:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save salary record",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(2000, i, 1).toLocaleString("default", { month: "long" }),
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {record ? "Edit Salary Record" : "Add New Salary Record"}
          </DialogTitle>
          <DialogDescription>
            {record
              ? "Update the employee's salary information."
              : "Add a new salary record for an employee."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Employee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isEmployeeLoading || !!record}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isEmployeeLoading ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            Loading employees...
                          </div>
                        ) : employees.length === 0 ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            No employees found
                          </div>
                        ) : (
                          employees.map((employee) => (
                            <SelectItem
                              key={employee.id}
                              value={employee.id}
                            >
                              {employee.name} ({employee.employeeId})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basicSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Basic Salary</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bonus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deductions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deductions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2 p-4 bg-muted/50 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Net Salary:</span>
                  <span className="text-lg font-semibold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(
                      (form.watch("basicSalary") || 0) +
                        (form.watch("bonus") || 0) -
                        (form.watch("deductions") || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {record ? "Update" : "Create"} Record
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
