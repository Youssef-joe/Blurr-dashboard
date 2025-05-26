import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DepartmentChart } from "@/components/dashboard/department-chart";
import { ProjectProgress } from "@/components/dashboard/project-progress";
import { SalaryTrend } from "@/components/dashboard/salary-trend";
import { Users, Briefcase, DollarSign, CheckSquare } from "lucide-react";

export default function Home() {
  // Sample data for metrics
  const metrics = [
    {
      id: "1",
      title: "Total Employees",
      value: "124",
      description: "Active employees across all departments",
      icon: Users,
      trend: { value: 8, isPositive: true },
    },
    {
      id: "2",
      title: "Active Projects",
      value: "12",
      description: "Projects currently in progress",
      icon: Briefcase,
      trend: { value: 12, isPositive: true },
    },
    {
      id: "3",
      title: "Monthly Payroll",
      value: "$284,500",
      description: "Total payroll for current month",
      icon: DollarSign,
      trend: { value: 4, isPositive: true },
    },
    {
      id: "4",
      title: "Pending Tasks",
      value: "38",
      description: "Tasks awaiting completion",
      icon: CheckSquare,
      trend: { value: 2, isPositive: false },
    },
  ];

  // Sample data for activities
  const activities = [
    {
      id: "1",
      user: {
        name: "Sarah Chen",
        initials: "SC",
      },
      action: "onboarded a new employee",
      target: "Alex Johnson",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      user: {
        name: "Michael Torres",
        initials: "MT",
      },
      action: "updated the status of",
      target: "Website Redesign Project",
      timestamp: "4 hours ago",
    },
    {
      id: "3",
      user: {
        name: "Jessica Kim",
        initials: "JK",
      },
      action: "processed payroll for",
      target: "Marketing Department",
      timestamp: "Yesterday at 3:45 PM",
    },
    {
      id: "4",
      user: {
        name: "Robert Chen",
        initials: "RC",
      },
      action: "added a new task to",
      target: "Q3 Planning",
      timestamp: "Yesterday at 1:30 PM",
    },
    {
      id: "5",
      user: {
        name: "Anna Martinez",
        initials: "AM",
      },
      action: "commented on",
      target: "Product Launch Timeline",
      timestamp: "2 days ago",
    },
  ];

  // Sample data for department chart
  const departmentData = [
    { name: "Engineering", value: 42, color: "hsl(var(--chart-1))" },
    { name: "Marketing", value: 18, color: "hsl(var(--chart-2))" },
    { name: "Sales", value: 25, color: "hsl(var(--chart-3))" },
    { name: "HR", value: 12, color: "hsl(var(--chart-4))" },
    { name: "Finance", value: 8, color: "hsl(var(--chart-5))" },
  ];

  // Sample data for project progress
  const projectData = [
    { name: "Website Redesign", completed: 75, total: 100 },
    { name: "Mobile App", completed: 45, total: 100 },
    { name: "CRM Integration", completed: 90, total: 100 },
    { name: "Marketing Campaign", completed: 30, total: 100 },
    { name: "Q4 Planning", completed: 60, total: 100 },
  ];

  // Sample data for salary trends
  const salaryData = [
    { month: "Jan", average: 5500, total: 250000 },
    { month: "Feb", average: 5600, total: 252000 },
    { month: "Mar", average: 5650, total: 260000 },
    { month: "Apr", average: 5700, total: 268000 },
    { month: "May", average: 5750, total: 275000 },
    { month: "Jun", average: 5800, total: 284500 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        {/* Metrics section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              icon={metric.icon}
              trend={metric.trend}
            />
          ))}
        </div>
        
        {/* Activity and Actions section */}
        <div className="grid gap-4 md:grid-cols-2">
          <ActivityFeed activities={activities} />
          <QuickActions />
        </div>
        
        {/* Charts section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DepartmentChart data={departmentData} />
          <ProjectProgress data={projectData} />
          <SalaryTrend data={salaryData} />
        </div>
      </div>
    </DashboardLayout>
  );
}