import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { useItems, DbItem } from "@/hooks/useItems";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, X, Clock, Package, Shield } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuthContext();
  const { fetchPendingItems, fetchAllItems, updateItemStatus } = useItems();
  const { toast } = useToast();
  
  const [pendingItems, setPendingItems] = useState<DbItem[]>([]);
  const [allItems, setAllItems] = useState<DbItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    const loadItems = async () => {
      if (isAdmin) {
        const [pending, all] = await Promise.all([
          fetchPendingItems(),
          fetchAllItems(),
        ]);
        setPendingItems(pending);
        setAllItems(all);
        setLoading(false);
      }
    };
    loadItems();
  }, [isAdmin, fetchPendingItems, fetchAllItems]);

  const handleApprove = async (itemId: string) => {
    try {
      await updateItemStatus(itemId, "approved");
      toast({ title: "Item Approved", description: "The item is now visible to all users." });
      // Refresh lists
      const [pending, all] = await Promise.all([
        fetchPendingItems(),
        fetchAllItems(),
      ]);
      setPendingItems(pending);
      setAllItems(all);
    } catch {
      toast({ title: "Error", description: "Failed to approve item.", variant: "destructive" });
    }
  };

  const handleReject = async (itemId: string) => {
    try {
      await updateItemStatus(itemId, "rejected");
      toast({ title: "Item Rejected", description: "The item has been rejected." });
      // Refresh lists
      const [pending, all] = await Promise.all([
        fetchPendingItems(),
        fetchAllItems(),
      ]);
      setPendingItems(pending);
      setAllItems(all);
    } catch {
      toast({ title: "Error", description: "Failed to reject item.", variant: "destructive" });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600"><Check className="mr-1 h-3 w-3" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600"><X className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const ItemRow = ({ item, showActions }: { item: DbItem; showActions: boolean }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="h-20 w-20 rounded-md object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.category} • {item.type}</p>
                <p className="mt-1 text-sm line-clamp-2">{item.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Reported: {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(item.status)}
                {showActions && item.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => handleApprove(item.id)}>
                      <Check className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(item.id)}>
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle>Admin Dashboard</CardTitle>
            </div>
            <CardDescription>
              Review and manage reported items. Approve items to make them visible to all users.
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending Review ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Items ({allItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingItems.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Check className="mx-auto mb-2 h-12 w-12 text-green-500" />
                  <p className="text-muted-foreground">No items pending review!</p>
                </CardContent>
              </Card>
            ) : (
              pendingItems.map((item) => (
                <ItemRow key={item.id} item={item} showActions={true} />
              ))
            )}
          </TabsContent>

          <TabsContent value="all">
            {allItems.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Package className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No items reported yet.</p>
                </CardContent>
              </Card>
            ) : (
              allItems.map((item) => (
                <ItemRow key={item.id} item={item} showActions={false} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
