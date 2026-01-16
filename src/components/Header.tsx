import { Link } from "react-router-dom";
import { Search } from "lucide-react";

// Simple header with app title and home link
const Header = () => {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="flex items-center gap-3 w-fit">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Search className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              University Lost & Found
            </h1>
            <p className="text-sm text-muted-foreground">
              Report lost items or find what you're looking for
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
