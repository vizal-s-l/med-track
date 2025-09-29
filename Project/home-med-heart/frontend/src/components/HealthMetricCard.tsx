import { TrendingUp, TrendingDown, Minus, Heart, Droplet, Weight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HealthMetric {
  id: string;
  type: 'blood_pressure' | 'blood_sugar' | 'weight';
  value: string;
  unit: string;
  date: string;
  time: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'high' | 'low';
}

interface HealthMetricCardProps {
  metric: HealthMetric;
  onClick?: () => void;
}

export default function HealthMetricCard({ metric, onClick }: HealthMetricCardProps) {
  const getIcon = () => {
    switch (metric.type) {
      case 'blood_pressure':
        return <Heart className="h-4 w-4" />;
      case 'blood_sugar':
        return <Droplet className="h-4 w-4" />;
      case 'weight':
        return <Weight className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getTitle = () => {
    switch (metric.type) {
      case 'blood_pressure':
        return 'Blood Pressure';
      case 'blood_sugar':
        return 'Blood Sugar';
      case 'weight':
        return 'Weight';
      default:
        return 'Health Metric';
    }
  };

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-warning" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-success" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    if (!metric.status) return null;

    const statusClasses = {
      normal: "status-in-stock",
      high: "status-low-stock",
      low: "status-out-of-stock"
    };

    return (
      <Badge className={`status-indicator ${statusClasses[metric.status]}`}>
        {metric.status}
      </Badge>
    );
  };

  return (
    <div 
      className="health-metric-card animate-scale-in cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-md">
            {getIcon()}
          </div>
          <h3 className="font-medium text-sm">{getTitle()}</h3>
        </div>
        {getTrendIcon()}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold">{metric.value}</span>
          <span className="text-sm opacity-80">{metric.unit}</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs opacity-75">
            {metric.date} at {metric.time}
          </p>
          {getStatusBadge()}
        </div>
      </div>
    </div>
  );
}