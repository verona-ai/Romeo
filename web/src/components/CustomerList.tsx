import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  prisma,
  type Customer
} from "../../../packages/database/src/client";

export default async function CustomerList() {
  const customers: Customer[] = await prisma.customer.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customer Dashboard</h1>
        <Badge variant="outline">
          {customers.length} customer{customers.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  );
}

function CustomerCard({ customer }: { customer: Customer }) {
  const statusColor = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-800", 
    SUSPENDED: "bg-red-100 text-red-800"
  }[customer.status];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{customer.name}</CardTitle>
          <Badge className={statusColor}>
            {customer.status}
          </Badge>
        </div>
        <CardDescription>
          {customer.email}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          {customer.phone && (
            <p className="text-sm text-muted-foreground">
              📞 {customer.phone}
            </p>
          )}
          
          <p className="text-xs text-muted-foreground">
            Created: {new Date(customer.createdAt).toLocaleDateString()}
          </p>
          
          {customer.metadata && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Metadata:</span>
              <pre className="mt-1 text-xs">
                {JSON.stringify(customer.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-4 pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            💬 Conversation history managed by Romeo AI Agent
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
