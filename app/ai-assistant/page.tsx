"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, User, HelpCircle, CheckCircle, FileText, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Blurr HR Assistant. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple function to generate AI responses based on keywords
  const getAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("vacation") || input.includes("leave") || input.includes("time off")) {
      return "To request time off, go to the 'Time Off' section in your employee portal. You currently have 15 vacation days available. Would you like me to help you submit a request?";
    } else if (input.includes("payroll") || input.includes("salary") || input.includes("pay")) {
      return "The next payroll is scheduled for July 15th. If you have specific questions about your salary or deductions, you can view your pay stubs in the Payroll section or speak with Jessica in HR.";
    } else if (input.includes("benefits") || input.includes("insurance") || input.includes("health")) {
      return "Your benefits package includes health, dental, and vision insurance, a 401(k) with 4% company match, and wellness benefits. Open enrollment starts in November. Would you like me to send you the benefits guide?";
    } else if (input.includes("policy") || input.includes("handbook")) {
      return "You can find the employee handbook in the Documents section of the HR portal. It includes all company policies including work hours, dress code, and code of conduct. Is there a specific policy you're looking for?";
    } else if (input.includes("training") || input.includes("course") || input.includes("learn")) {
      return "We have several training opportunities available. The Learning Management System has courses on leadership, technical skills, and compliance. Would you like me to recommend some courses based on your role?";
    } else {
      return "I'm here to help with HR-related questions about benefits, payroll, time off, company policies, and more. How can I assist you today?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Suggested questions
  const suggestedQuestions = [
    "How do I request time off?",
    "When is the next payday?",
    "What benefits are available to me?",
    "Where can I find company policies?",
    "Are there training opportunities available?"
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-240px)]">
              <CardHeader className="border-b px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 p-1">
                    <Bot className="h-full w-full text-primary" />
                  </div>
                  <div>
                    <CardTitle>Blurr HR Assistant</CardTitle>
                    <CardDescription>Powered by AI</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                        message.role === "user"
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {message.role === "assistant" ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {message.role === "assistant" ? "Assistant" : "You"}
                        </span>
                      </div>
                      <p>{message.content}</p>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <span className="font-medium">Assistant</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground delay-75"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground delay-150"></div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t p-3">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Questions</CardTitle>
                <CardDescription>
                  Common HR questions you might have
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setInput(question);
                      }}
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>HR Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-left">
                    <Calendar className="mr-2 h-4 w-4" />
                    Request Time Off
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <FileText className="mr-2 h-4 w-4" />
                    View Pay Stubs
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Expense Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}