import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { useItems } from "@/hooks/useItems";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileWarning, Search, Plus, Package } from "lucide-react";

const Home = () => {
  const { user, loading: authLoading } = useAuthContext();
  const { items, loading: itemsLoading } = useItems();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Campus Lost & Found
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lost something on campus? Report it here. Found something? Help reunite items with their owners.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 mb-2">
                <FileWarning className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Report Lost Item</CardTitle>
              <CardDescription>
                Lost something? Report it to help others find and return it to you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <Button onClick={() => navigate("/report")} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Report Lost Item
                </Button>
              ) : (
                <Button onClick={() => navigate("/login")} variant="outline" className="w-full">
                  Sign in to Report
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Search Found Items</CardTitle>
              <CardDescription>
                Looking for something you lost? Browse items that have been found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/search">
                <Button variant="outline" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Search Items
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recently Approved Items */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recently Reported Items</h2>
            <Button variant="ghost" onClick={() => navigate("/search")}>
              View All →
            </Button>
          </div>

          {itemsLoading || authLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-64 animate-pulse bg-muted" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No items yet</h3>
                <p className="text-muted-foreground">
                  Be the first to report a lost or found item!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, 6).map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
