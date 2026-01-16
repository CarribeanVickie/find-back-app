import { useNavigate, useParams } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Calendar, Tag, FileText } from "lucide-react";

// Detail view for a single item
const ItemDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getItemById } = useItems();

  const item = id ? getItemById(id) : undefined;

  // Handle item not found
  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-md text-center py-12">
            <CardContent>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Item Not Found
              </h2>
              <p className="text-muted-foreground mb-4">
                The item you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/")}>
                Go Home
              </Button>
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
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-2xl">{item.name}</CardTitle>
              <Badge
                className={item.status === "found" ? "status-found" : "status-lost"}
              >
                {item.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Placeholder image */}
            <div className="flex h-48 items-center justify-center rounded-lg bg-muted">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>

            {/* Item details */}
            <div className="space-y-4">
              {/* Category */}
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="text-foreground">{item.category}</p>
                </div>
              </div>

              {/* Description */}
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-foreground">{item.description}</p>
                </div>
              </div>

              {/* Date Reported */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date Reported</p>
                  <p className="text-foreground">
                    {item.dateReported.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Action hint */}
            <div className="rounded-lg bg-accent p-4">
              <p className="text-sm text-accent-foreground">
                {item.status === "found"
                  ? "If this is your item, please visit the campus Lost & Found office to claim it. Bring valid ID."
                  : "We've recorded this lost item. Check back later to see if it has been found."}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ItemDetail;
