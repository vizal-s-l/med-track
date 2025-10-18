import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealthMetrics } from "@/hooks/useApi";
import HealthMetricCard from "@/components/HealthMetricCard";

const HealthMetricsPage = () => {
  const navigate = useNavigate();
  const { data: healthMetrics = [], isLoading, error } = useHealthMetrics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading health records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Failed to load health records. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Health Metrics</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Review all logged health records in chronological order.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthMetrics.length === 0 ? (
              <p className="text-muted-foreground text-sm">No health metrics logged yet.</p>
            ) : (
              healthMetrics
                .slice()
                .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
                .map((metric) => (
                  <HealthMetricCard key={metric.id} metric={metric} onClick={() => {}} />
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthMetricsPage;
