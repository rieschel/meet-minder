
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20">
      <div className="text-center glass-card p-8 rounded-lg border border-border/30 max-w-md mx-auto animate-scale-in">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate('/')}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
