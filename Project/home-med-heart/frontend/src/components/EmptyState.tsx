import { Plus, Pill, Activity, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: 'medicines' | 'health_metrics' | 'purchases';
  onAction: () => void;
}

export default function EmptyState({ type, onAction }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'medicines':
        return {
          icon: <Pill className="h-12 w-12 text-muted-foreground" />,
          title: "No medicines added yet",
          description: "Start by adding your first medicine to track dosages and stock levels.",
          actionLabel: "Add Medicine",
        };
      case 'health_metrics':
        return {
          icon: <Activity className="h-12 w-12 text-muted-foreground" />,
          title: "No health metrics recorded",
          description: "Track your blood pressure, blood sugar, and weight to monitor your health.",
          actionLabel: "Log Metric",
        };
      case 'purchases':
        return {
          icon: <ShoppingCart className="h-12 w-12 text-muted-foreground" />,
          title: "No purchases logged",
          description: "Keep track of your medicine purchases and expenses here.",
          actionLabel: "Log Purchase",
        };
      default:
        return {
          icon: <Plus className="h-12 w-12 text-muted-foreground" />,
          title: "Nothing here yet",
          description: "Get started by adding your first item.",
          actionLabel: "Add Item",
        };
    }
  };

  const content = getContent();

  return (
    <div className="empty-state animate-fade-in-up">
      <div className="flex justify-center mb-4">
        {content.icon}
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {content.title}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {content.description}
      </p>
      
      <Button 
        onClick={onAction}
        className="btn-medical"
      >
        <Plus className="h-4 w-4 mr-2" />
        {content.actionLabel}
      </Button>
    </div>
  );
}