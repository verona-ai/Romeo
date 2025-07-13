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
  type Customer,
  type MastraMessage,
  type MastraThread
} from "../../../packages/database/src/client";

type CustomerWithThreads = Customer & {
  threads: (MastraThread & { messages: MastraMessage[] })[];
};

export default async function CustomerList() {
  const customers: CustomerWithThreads[] = await prisma.customer.findMany({
    include: {
      threads: {
        include: {
          messages: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (customers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No customers found. Create your first customer to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {customers.map((customer) => (
        <Card key={customer.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{customer.name}</CardTitle>
              <Badge
                variant={customer.status === "ACTIVE" ? "default" : "secondary"}
              >
                {customer.status}
              </Badge>
            </div>
            <CardDescription>{customer.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Conversations:</span>
                <span className="font-medium">{customer.threads.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Total Messages:</span>
                <span className="font-medium">
                  {customer.threads.reduce(
                    (
                      total: number,
                      thread: MastraThread & { messages: MastraMessage[] }
                    ) => total + thread.messages.length,
                    0
                  )}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Joined {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
