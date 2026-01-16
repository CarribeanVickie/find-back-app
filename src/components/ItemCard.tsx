import { Link } from "react-router-dom";
import { Item } from "@/types/item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface ItemCardProps {
  item: Item;
}

// Card component to display item summary in list views
const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <Link to={`/item/${item.id}`}>
      <Card className="transition-all hover:shadow-md hover:border-primary/30 cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold line-clamp-1">
              {item.name}
            </CardTitle>
            <Badge
              variant="secondary"
              className={item.status === "found" ? "status-found" : "status-lost"}
            >
              {item.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Placeholder image area */}
          <div className="mb-3 flex h-24 items-center justify-center rounded-md bg-muted">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          
          {/* Category badge */}
          <Badge variant="outline" className="mb-2">
            {item.category}
          </Badge>
          
          {/* Description preview */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
          
          {/* Date reported */}
          <p className="mt-2 text-xs text-muted-foreground">
            Reported: {item.dateReported.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ItemCard;
