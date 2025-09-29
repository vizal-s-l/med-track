import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Plus, Heart, DollarSign, Package, Activity } from "lucide-react";
import MedicineCard from "@/components/MedicineCard";
import HealthMetricCard from "@/components/HealthMetricCard";
import EmptyState from "@/components/EmptyState";
import AddMedicineModal from "@/components/AddMedicineModal";
import LogHealthMetricModal from "@/components/LogHealthMetricModal";

// Sample data - in real app this would come from API
const sampleMedicines = [
  {
    id: "1",
    name: "Aspirin",
    dosage: "500mg",
    frequency: "Twice daily",
    currentStock: 8,
    threshold: 10,
    totalQuantity: 30,
    nextDue: "Today, 2:00 PM"
  },
  {
    id: "2", 
    name: "Vitamin D3",
    dosage: "1000 IU",
    frequency: "Once daily",
    currentStock: 25,
    threshold: 7,
    totalQuantity: 60,
    nextDue: "Tomorrow, 8:00 AM"
  },
  {
    id: "3",
    name: "Blood Pressure Medication",
    dosage: "10mg",
    frequency: "Once daily", 
    currentStock: 2,
    threshold: 5,
    totalQuantity: 30,
    nextDue: "Today, 8:00 AM"
  }
];

const sampleHealthMetrics = [
  {
    id: "1",
    type: "blood_pressure" as const,
    value: "120/80",
    unit: "mmHg", 
    date: "Today",
    time: "9:30 AM",
    trend: "stable" as const,
    status: "normal" as const
  },
  {
    id: "2",
    type: "blood_sugar" as const,
    value: "95",
    unit: "mg/dL",
    date: "Today", 
    time: "8:15 AM",
    trend: "down" as const,
    status: "normal" as const
  },
  {
    id: "3",
    type: "weight" as const,
    value: "70.2",
    unit: "kg",
    date: "Yesterday",
    time: "7:00 AM", 
    trend: "up" as const,
    status: "normal" as const
  }
];

export default function Dashboard() {
  const [medicines, setMedicines] = useState(sampleMedicines);
  const [healthMetrics, setHealthMetrics] = useState(sampleHealthMetrics);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isLogMetricOpen, setIsLogMetricOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const lowStockMedicines = medicines.filter(med => med.currentStock <= med.threshold);
  const outOfStockMedicines = medicines.filter(med => med.currentStock === 0);
  const totalExpenses = 245.50; // Sample data

  const handleAddMedicine = (medicine: any) => {
    if (editingMedicine) {
      setMedicines(prev => prev.map(m => m.id === medicine.id ? medicine : m));
      setEditingMedicine(null);
    } else {
      setMedicines(prev => [...prev, medicine]);
    }
    setIsAddMedicineOpen(false);
  };

  const handleEditMedicine = (medicine: any) => {
    setEditingMedicine(medicine);
    setIsAddMedicineOpen(true);
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const handleLogMetric = (metric: any) => {
    setHealthMetrics(prev => [metric, ...prev]);
    setIsLogMetricOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Home Med+ Tracker</h1>
              <p className="text-sm sm:text-base text-muted-foreground hidden sm:block">Manage your family's health with confidence</p>
            </div>
            <Button 
              onClick={() => setIsAddMedicineOpen(true)}
              className="btn-medical shrink-0 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Alert Cards */}
        {(lowStockMedicines.length > 0 || outOfStockMedicines.length > 0) && (
          <div className="mb-4 sm:mb-8">
            <div className="alert-card">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-warning mt-0.5" />
                <div className="min-w-0">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Stock Alerts</h3>
                  <p className="text-xs sm:text-sm">
                    {outOfStockMedicines.length > 0 && (
                      <span className="text-destructive font-medium">
                        {outOfStockMedicines.length} medicine(s) out of stock
                      </span>
                    )}
                    {outOfStockMedicines.length > 0 && lowStockMedicines.length > 0 && (
                      <span className="mx-1 sm:mx-2">•</span>
                    )}
                    {lowStockMedicines.length > 0 && (
                      <span>
                        {lowStockMedicines.length} medicine(s) running low
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <Card className="animate-fade-in-up">
            <CardHeader className="pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <Package className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
                <span className="truncate">Total Medicines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg sm:text-2xl font-bold">{medicines.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-warning shrink-0" />
                <span className="truncate">Low Stock Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg sm:text-2xl font-bold text-warning">{lowStockMedicines.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-medical-green shrink-0" />
                <span className="truncate">Health Records</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg sm:text-2xl font-bold text-medical-green">{healthMetrics.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Medicines Section */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Your Medicines</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAddMedicineOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </div>

            {medicines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {medicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onEdit={handleEditMedicine}
                    onDelete={handleDeleteMedicine}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <EmptyState 
                    type="medicines" 
                    onAction={() => setIsAddMedicineOpen(true)}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Health Metrics Overview */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Health Overview</h2>
              <Button 
                onClick={() => setIsLogMetricOpen(true)}
                className="btn-medical w-full sm:w-auto"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Log Metric
              </Button>
            </div>

            {healthMetrics.length > 0 ? (
              <div className="grid gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Recent Health Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {healthMetrics.slice(0, 3).map((metric) => (
                      <HealthMetricCard
                        key={metric.id}
                        metric={metric}
                        onClick={() => console.log('View metric details')}
                      />
                    ))}
                    {healthMetrics.length > 3 && (
                      <div className="text-center pt-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          View all {healthMetrics.length} records →
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <EmptyState 
                    type="health_metrics" 
                    onAction={() => setIsLogMetricOpen(true)}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Add Medicine Modal */}
      <AddMedicineModal
        isOpen={isAddMedicineOpen}
        onClose={() => {
          setIsAddMedicineOpen(false);
          setEditingMedicine(null);
        }}
        onSave={handleAddMedicine}
        editingMedicine={editingMedicine}
      />

      {/* Log Health Metric Modal */}
      <LogHealthMetricModal
        isOpen={isLogMetricOpen}
        onClose={() => setIsLogMetricOpen(false)}
        onSave={handleLogMetric}
      />
    </div>
  );
}