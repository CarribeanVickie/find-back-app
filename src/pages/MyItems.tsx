import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { useItems, DbItem } from "@/hooks/useItems";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Clock, Check, X, Plus } from "lucide-react";

const MyItems = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthContext();
  const { fetchUserItems } = useItems();
  const [items, setItems] = useState<DbItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const loadItems = async () => {
      if (user) {
        const userItems = await fetchUserItems();
        setItems(userItems);
        setLoading(false);
      }
    };
    loadItems();
  }, [user, fetchUserItems]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600"><Clock className="mr-1 h-3 w-3" />Pending Review</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600"><Check className="mr-1 h-3 w-3" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600"><X className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Reported Items</h1>
            <p className="text-muted-foreground">Track the status of items you've reported</p>
          </div>
          <Button onClick={() => navigate("/report")}>
            <Plus className="mr-2 h-4 w-4" />
            Report New Item
          </Button>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No items reported yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't reported any lost or found items yet.
              </p>
              <Button onClick={() => navigate("/report")}>
                Report Your First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-muted">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    {getStatusBadge(item.status)}
                  </div>
                  <CardDescription>
                    {item.category} • {item.type === "lost" ? "Lost" : "Found"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Reported: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  {item.admin_notes && item.status === "rejected" && (
                    <div className="mt-2 rounded bg-red-50 p-2 text-xs text-red-600">
                      <strong>Admin note:</strong> {item.admin_notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyItems;
