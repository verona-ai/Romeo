import CustomerList from "@/components/CustomerList";
import ChatInterface from "@/components/ChatInterface";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { Suspense } from "react";
import { Bot, Users, MessageSquare, Activity } from "lucide-react";

export default async function DashboardPage() {
  const customerCount = await prisma.customer.count();
  const conversationCount = await prisma.conversation.count();
  const todayMessages = await prisma.message.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Romeo AI Dashboard</h1>
        <p className="text-muted-foreground">
          Modern AI customer service platform powered by OpenAI & Supabase
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount}</div>
            <p className="text-xs text-muted-foreground">Active customer base</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversationCount}</div>
            <p className="text-xs text-muted-foreground">Total conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Messages</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMessages}</div>
            <p className="text-xs text-muted-foreground">Messages handled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Romeo Status</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Activity className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">AI Agent Running</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Chat with Romeo</CardTitle>
            <CardDescription>
              Try out the AI assistant - powered by OpenAI and deployed on AWS via SST
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChatInterface />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modern Stack</CardTitle>
            <CardDescription>
              Simple, scalable, and production-ready
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Next.js 15</Badge>
              <span className="text-sm">Frontend + API Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Supabase</Badge>
              <span className="text-sm">Database + Auth + Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">SST</Badge>
              <span className="text-sm">AWS Infrastructure as Code</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">OpenAI</Badge>
              <span className="text-sm">AI Models</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Vercel</Badge>
              <span className="text-sm">Frontend Deployment</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            Manage your customer base and view conversation history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading customers...</div>}>
            <CustomerList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
