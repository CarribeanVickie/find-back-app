import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, Package } from "lucide-react";
import Header from "@/components/Header";

// Home screen with two main action buttons
const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <Package className="h-8 w-8 text-accent-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Welcome to Lost & Found
          </h2>
          <p className="mt-2 text-muted-foreground">
            Lost something on campus? Found an item? We're here to help.
          </p>
        </div>

        {/* Two main action cards */}
        <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
          {/* Report Lost Item Card */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <FileText className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Report Lost Item</CardTitle>
              <CardDescription>
                Lost something? Report it here and we'll help you find it.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/report">
                <Button className="w-full" size="lg">
                  Report Lost Item
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Search Found Items Card */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--success))]/10">
                <Search className="h-6 w-6 text-[hsl(var(--success))]" />
              </div>
              <CardTitle>Search Found Items</CardTitle>
              <CardDescription>
                Browse items that have been found on campus.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/search">
                <Button variant="secondary" className="w-full" size="lg">
                  Search Found Items
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick stats info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Helping students reconnect with their belongings since 2024
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;
