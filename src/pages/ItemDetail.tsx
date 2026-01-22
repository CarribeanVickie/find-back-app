import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useItems, DbItem } from "@/hooks/useItems";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Tag, FileText, Package } from "lucide-react";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById } = useItems();
  const [item, setItem] = useState<DbItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      if (id) {
        const fetchedItem = await getItemById(id);
        setItem(fetchedItem);
      }
      setLoading(false);
    };
    loadItem();
  }, [id, getItemById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </main>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-md text-center">
            <CardContent className="pt-8">
              <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="text-xl font-bold mb-2">Item Not Found</h2>
              <p className="text-muted-foreground mb-4">
                This item doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/")}>Go Home</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Image */}
          <div>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full rounded-lg object-cover aspect-square"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl">{item.name}</CardTitle>
                <Badge
                  variant="secondary"
                  className={item.type === "found" ? "status-found" : "status-lost"}
                >
                  {item.type}
                </Badge>
              </div>
              <CardDescription>
                {item.status === "pending" && "Pending approval"}
                {item.status === "approved" && "Verified listing"}
                {item.status === "rejected" && "Not approved"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="outline">{item.category}</Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Reported:</span>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Description:</span>
                </div>
                <p className="text-sm pl-6">{item.description}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {item.type === "found"
                    ? "If this is your item, please contact the university lost & found office."
                    : "If you found this item, please bring it to the lost & found office."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ItemDetail;
