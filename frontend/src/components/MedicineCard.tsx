import { Pill, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Medicine {
  id: string;
  name: string;
  totalQuantity: number;
  currentStock: number;
  price: number;
  morning_qty: number;
  afternoon_qty: number;
  night_qty: number;
  threshold: number;
  lastTaken?: string;
  nextDue?: string;
}

interface MedicineCardProps {
  medicine: Medicine;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
}

export default function MedicineCard({ medicine, onEdit, onDelete }: MedicineCardProps) {
  const stockPercentage = (medicine.currentStock / medicine.totalQuantity) * 100;
  const isLowStock = medicine.currentStock <= medicine.threshold;
  const isOutOfStock = medicine.currentStock === 0;

  const getStockStatus = () => {
    if (isOutOfStock) return "Out of Stock";
    if (isLowStock) return "Low Stock";
    return "In Stock";
  };

  const getStockStatusClass = () => {
    if (isOutOfStock) return "status-out-of-stock";
    if (isLowStock) return "status-low-stock";
    return "status-in-stock";
  };

  return (
    <div className="medicine-card animate-fade-in-up group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-light rounded-lg">
            <Pill className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{medicine.name}</h3>
            <p className="text-sm text-muted-foreground">
              {medicine.morning_qty > 0 && `${medicine.morning_qty} morning`}
              {medicine.afternoon_qty > 0 && ` • ${medicine.afternoon_qty} afternoon`}
              {medicine.night_qty > 0 && ` • ${medicine.night_qty} night`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(medicine)}
            className="h-8 w-8 p-0 hover:bg-primary-light"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(medicine.id)}
            className="h-8 w-8 p-0 hover:bg-error-light text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Stock Level</span>
          <Badge className={`status-indicator ${getStockStatusClass()}`}>
            {isLowStock && <AlertTriangle className="h-3 w-3" />}
            {getStockStatus()}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {medicine.currentStock} of {medicine.totalQuantity} pills
            </span>
            <span className="font-medium">{Math.round(stockPercentage)}%</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className={`progress-fill ${isLowStock ? 'bg-warning' : ''}`}
              style={{ width: `${Math.max(stockPercentage, 2)}%` }}
            />
          </div>
        </div>

        {medicine.nextDue && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Next refill: <span className="text-foreground font-medium">{medicine.nextDue}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}