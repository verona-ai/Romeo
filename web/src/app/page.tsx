import CustomerList from "@/components/CustomerList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { Suspense } from "react";

export default async function DashboardPage() {
  const customerCount = await prisma.customer.count();
  const threadCount = await prisma.mastraThread.count();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Romeo Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your AI customer experience agent
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threadCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
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
