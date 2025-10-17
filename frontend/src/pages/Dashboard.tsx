import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Plus, Heart, DollarSign, Package, Activity, LogOut, WifiOff } from "lucide-react";
import MedicineCard from "@/components/MedicineCard";
import HealthMetricCard from "@/components/HealthMetricCard";
import EmptyState from "@/components/EmptyState";
import AddMedicineModal from "@/components/AddMedicineModal";
import LogHealthMetricModal from "@/components/LogHealthMetricModal";
import GlobalTimingSettings from "@/components/GlobalTimingSettings";
import TodaysIntakes from "@/components/TodaysIntakes";
import {
  useMedicines,
  useCreateMedicine,
  useUpdateMedicine,
  useDeleteMedicine,
  useHealthMetrics,
  useCreateHealthMetric,
  useHealthCheck
} from "@/hooks/useApi";
import { type Medicine, type HealthMetric } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isLogMetricOpen, setIsLogMetricOpen] = useState(false);
  const [isTimingSettingsOpen, setIsTimingSettingsOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  // Auth hooks
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // API hooks
  const { data: medicines = [], isLoading: medicinesLoading, error: medicinesError } = useMedicines();
  const { data: healthMetrics = [], isLoading: metricsLoading, error: metricsError } = useHealthMetrics();
  const { data: isConnected = false } = useHealthCheck();

  // Mutations
  const createMedicineMutation = useCreateMedicine();
  const updateMedicineMutation = useUpdateMedicine();
  const deleteMedicineMutation = useDeleteMedicine();
  const createHealthMetricMutation = useCreateHealthMetric();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const lowStockMedicines = medicines.filter(med => med.currentStock <= med.threshold);
  const outOfStockMedicines = medicines.filter(med => med.currentStock === 0);

  const handleAddMedicine = async (medicine: Omit<Medicine, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingMedicine) {
        await updateMedicineMutation.mutateAsync({
          id: editingMedicine.id,
          data: medicine
        });
        setEditingMedicine(null);
      } else {
        await createMedicineMutation.mutateAsync(medicine);
      }
      setIsAddMedicineOpen(false);
    } catch (error) {
      console.error('Failed to save medicine:', error);
      // TODO: Show error toast
    }
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsAddMedicineOpen(true);
  };

  const handleDeleteMedicine = async (id: string) => {
    try {
      await deleteMedicineMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete medicine:', error);
      // TODO: Show error toast
    }
  };

  const handleLogMetric = async (metric: Omit<HealthMetric, 'id' | 'created_at'>) => {
    try {
      await createHealthMetricMutation.mutateAsync(metric);
      setIsLogMetricOpen(false);
    } catch (error) {
      console.error('Failed to log health metric:', error);
      // TODO: Show error toast
    }
  };

  // Show loading state
  if (medicinesLoading || metricsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your health data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (medicinesError || metricsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <WifiOff className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
          <p className="text-muted-foreground mb-4">
            Unable to connect to the server. Please check your connection and try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="min-w-0 flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <img src="/favicon.ico" alt="Home" className="w-6 h-6" />
                <span className="text-sm font-semibold">Home</span>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Med Tracker</h1>
                <p className="text-sm sm:text-base text-muted-foreground hidden sm:block">
                  Track your medicines and health metrics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0]}
              </span>
              <Button 
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="shrink-0"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
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

        {/* Today's Intakes */}
        {false && (
          <div className="mb-4 sm:mb-8">
            <TodaysIntakes />
          </div>
        )}
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

      {/* Global Timing Settings Modal */}
      <GlobalTimingSettings
        isOpen={isTimingSettingsOpen}
        onClose={() => setIsTimingSettingsOpen(false)}
      />
    </div>
  );
}