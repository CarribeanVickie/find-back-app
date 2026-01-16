import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { CATEGORIES } from "@/types/item";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, PackageX } from "lucide-react";

// Search and filter found items by category
const SearchItems = () => {
  const navigate = useNavigate();
  const { items } = useItems();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter items: only "found" status and matching category
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Only show found items
      if (item.status !== "found") return false;
      
      // Filter by category if selected
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      
      return true;
    });
  }, [items, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Search className="h-6 w-6" />
            Search Found Items
          </h2>
          <p className="text-muted-foreground mt-1">
            Browse items that have been found on campus
          </p>
        </div>

        {/* Category filter */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Label htmlFor="category-filter" className="shrink-0">
                Filter by Category:
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Results grid */}
        {filteredItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          // Empty state
          <Card className="py-12">
            <CardContent className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <PackageX className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No Items Found
              </h3>
              <p className="text-muted-foreground mt-1">
                {selectedCategory !== "all"
                  ? `No found items in the "${selectedCategory}" category.`
                  : "No found items to display at this time."}
              </p>
              {selectedCategory !== "all" && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSelectedCategory("all")}
                >
                  Clear Filter
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SearchItems;
