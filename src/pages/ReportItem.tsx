import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { CATEGORIES } from "@/types/item";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle } from "lucide-react";

// Form to report a lost item
const ReportItem = () => {
  const navigate = useNavigate();
  const { addItem } = useItems();
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !category || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Add item with status "lost"
    addItem({
      name: name.trim(),
      category,
      description: description.trim(),
      image: "/placeholder.svg",
      status: "lost",
    });

    // Show success state
    setIsSubmitted(true);
    toast({
      title: "Report Submitted!",
      description: "Your lost item has been reported successfully.",
    });
  };

  // Success state after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-md text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--success))]/10">
                <CheckCircle className="h-8 w-8 text-[hsl(var(--success))]" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Report Submitted Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your lost item "{name}" has been added to our system. Check back later to see if it's been found.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Go Home
                </Button>
                <Button onClick={() => {
                  setIsSubmitted(false);
                  setName("");
                  setCategory("");
                  setDescription("");
                }}>
                  Report Another
                </Button>
              </div>
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
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Report Lost Item</CardTitle>
            <CardDescription>
              Fill out the form below to report an item you've lost on campus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Blue iPhone 14, Student ID Card"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item, where you last saw it, any identifying features..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg">
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReportItem;
