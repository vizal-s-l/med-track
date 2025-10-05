import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, SkipForward, Clock, Pill, RefreshCw } from "lucide-react";
import { useIntakes, useCreateIntake, useUpdateIntake, type Intake } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function TodaysIntakes() {
  const { toast } = useToast();
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: intakes, isLoading, error, refetch } = useIntakes(today);
  const createIntake = useCreateIntake();
  const updateIntake = useUpdateIntake();
  const [generating, setGenerating] = useState(false);

  // Generate daily intakes if none exist
  useEffect(() => {
    if (!isLoading && !error && (!intakes || intakes.length === 0)) {
      generateDailyIntakes();
    }
  }, [isLoading, error, intakes]);

  const generateDailyIntakes = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/intakes/generate-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today }),
      });

      if (response.ok) {
        refetch(); // Refresh the intakes data
      }
    } catch (error) {
      console.error('Error generating daily intakes:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleIntakeAction = async (intake: Intake, status: 'taken' | 'missed' | 'skipped') => {
    try {
      if (intake.id) {
        // Update existing intake
        await updateIntake.mutateAsync({
          id: intake.id,
          status,
          taken_time: status === 'taken' ? new Date().toISOString() : undefined,
        });
      } else {
        // Create new intake
        await createIntake.mutateAsync({
          medicine_id: intake.medicine_id,
          scheduled_time: intake.scheduled_time,
          status,
          quantity: intake.quantity,
          taken_time: status === 'taken' ? new Date().toISOString() : undefined,
        });
      }

      const messages = {
        taken: `${intake.medicines?.name} marked as taken`,
        missed: `${intake.medicines?.name} marked as missed`,
        skipped: `${intake.medicines?.name} marked as skipped`,
      };

      toast({
        title: "Intake Logged",
        description: messages[status],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log intake",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'missed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'skipped':
        return <SkipForward className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'taken':
        return 'default';
      case 'missed':
        return 'destructive';
      case 'skipped':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTimeSlot = (scheduledTime: string) => {
    const hour = new Date(scheduledTime).getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Night';
  };

  if (isLoading || generating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Medicine Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">
              {generating ? 'Generating today\'s schedule...' : 'Loading today\'s schedule...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Medicine Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to load today's schedule</p>
        </CardContent>
      </Card>
    );
  }

  // Group intakes by time slot
  const groupedIntakes = (intakes || []).reduce((acc, intake) => {
    const slot = getTimeSlot(intake.scheduled_time);
    if (!acc[slot]) acc[slot] = [];
    acc[slot].push(intake);
    return acc;
  }, {} as Record<string, Intake[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Today's Medicine Schedule
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateDailyIntakes}
            disabled={generating}
            className="h-8"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${generating ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedIntakes).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedIntakes).map(([timeSlot, slotIntakes]) => (
              <div key={timeSlot}>
                <h3 className="font-medium text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                  {timeSlot}
                </h3>
                <div className="space-y-3">
                  {slotIntakes.map((intake) => (
                    <div key={intake.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(intake.status)}
                        <div>
                          <p className="font-medium">{intake.medicines?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {intake.quantity} tablet(s) • {format(new Date(intake.scheduled_time), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(intake.status)}>
                          {intake.status}
                        </Badge>
                        {intake.status === 'scheduled' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleIntakeAction(intake, 'taken')}
                              disabled={createIntake.isPending || updateIntake.isPending}
                              className="h-8 px-2"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIntakeAction(intake, 'missed')}
                              disabled={createIntake.isPending || updateIntake.isPending}
                              className="h-8 px-2"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIntakeAction(intake, 'skipped')}
                              disabled={createIntake.isPending || updateIntake.isPending}
                              className="h-8 px-2"
                            >
                              <SkipForward className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No medicines scheduled for today</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add medicines to see your daily schedule
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}