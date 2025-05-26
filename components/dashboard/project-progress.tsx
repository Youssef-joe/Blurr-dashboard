"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LabelList 
} from "recharts";

interface ProjectProgressProps {
  data: {
    name: string;
    completed: number;
    total: number;
  }[];
}

export function ProjectProgress({ data }: ProjectProgressProps) {
  const chartData = data.map(item => ({
    name: item.name,
    progress: Math.round((item.completed / item.total) * 100),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip
                formatter={(value) => [`${value}%`, "Progress"]}
                labelStyle={{ color: "var(--foreground)" }}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                }}
              />
              <Bar 
                dataKey="progress" 
                fill="hsl(var(--chart-1))" 
                radius={[0, 4, 4, 0]}
              >
                <LabelList dataKey="progress" position="right" formatter={(value) => `${value}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}