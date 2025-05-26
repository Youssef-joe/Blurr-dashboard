"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  BarChart3,
  DollarSign,
  Briefcase,
  Kanban,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isOpen: boolean;
}

function SidebarItem({ href, icon, title, isOpen }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
    >
      {icon}
      <span
        className={cn(
          "transition-all duration-200",
          isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
        )}
      >
        {title}
      </span>
    </Link>
  );
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {isOpen && (
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-primary">
              Blurr<span className="text-blue-500">HR</span>
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("ml-auto")}
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <nav className="flex-1 overflow-auto px-3 py-4">
        <div className="space-y-1">
          <SidebarItem
            href="/"
            icon={<BarChart3 className="h-5 w-5" />}
            title="Dashboard"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/employees"
            icon={<Users className="h-5 w-5" />}
            title="Employees"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/payroll"
            icon={<DollarSign className="h-5 w-5" />}
            title="Payroll/Salary"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/projects"
            icon={<Briefcase className="h-5 w-5" />}
            title="Projects"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/tasks"
            icon={<Kanban className="h-5 w-5" />}
            title="Tasks/Kanban"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/ai-assistant"
            icon={<Bot className="h-5 w-5" />}
            title="AI Assistant"
            isOpen={isOpen}
          />
          <SidebarItem
            href="/settings"
            icon={<Settings className="h-5 w-5" />}
            title="Settings"
            isOpen={isOpen}
          />
        </div>
      </nav>
      
      <div className="border-t px-3 py-4">
        <div
          className={cn(
            "rounded-lg bg-primary/10 p-4 text-center",
            isOpen ? "block" : "hidden"
          )}
        >
          <p className="text-sm font-medium">Need help?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Check our documentation
          </p>
          <Button className="mt-3 w-full text-xs" size="sm">
            View Docs
          </Button>
        </div>
      </div>
    </aside>
  );
}