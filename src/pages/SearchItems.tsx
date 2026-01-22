import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/hooks/useItems";
import { CATEGORIES } from "@/types/item";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Package, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchItems = () => {
  const navigate = useNavigate();
  const { items, loading } = useItems();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items by category and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Search Items</h1>
          <p className="text-muted-foreground">
            Browse all approved lost and found items
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
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
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filter."
                  : "No items have been approved yet."}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SearchItems;
