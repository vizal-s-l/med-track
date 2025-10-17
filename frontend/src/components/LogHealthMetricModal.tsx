import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface LogHealthMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metric: any) => void;
}

const IST_TIMEZONE = "Asia/Kolkata";

const formatLocalValue = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day}`;
};

const formatLocalTime = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST_TIMEZONE,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  return formatter.format(date);
};

const toIstISOString = (date: string, time: string) => `${date}T${time}:00+05:30`;

export default function LogHealthMetricModal({ isOpen, onClose, onSave }: LogHealthMetricModalProps) {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    systolic: '',
    diastolic: '',
    heartbeat: '',
  });

  const [sugarData, setSugarData] = useState({
    sugar_context: '',
    sugar_value: '',
  });

  const initialDate = useMemo(() => formatLocalValue(new Date()), []);
  const initialTime = useMemo(() => formatLocalTime(new Date()), []);

  const [recordedAt, setRecordedAt] = useState({
    date: initialDate,
    time: initialTime,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hasPressure = profileData.systolic && profileData.diastolic && profileData.heartbeat;
    const hasSugar = sugarData.sugar_context && sugarData.sugar_value;

    if (!hasPressure && !hasSugar) {
      toast({
        title: "Missing Information",
        description: "Provide blood pressure or blood sugar details.",
        variant: "destructive",
      });
      return;
    }

    const payload: any = {
      type: hasPressure && hasSugar ? 'combined' : hasPressure ? 'blood_pressure' : 'blood_sugar',
      recorded_at: toIstISOString(recordedAt.date, recordedAt.time),
    };

    if (hasPressure) {
      payload.systolic = Number(profileData.systolic);
      payload.diastolic = Number(profileData.diastolic);
      payload.heartbeat = Number(profileData.heartbeat);
    }

    if (hasSugar) {
      payload.sugar_context = sugarData.sugar_context as 'fasting' | 'after_food' | 'random';
      payload.sugar_value = Number(sugarData.sugar_value);
    }

    onSave(payload);

    setProfileData({ systolic: '', diastolic: '', heartbeat: '' });
    setSugarData({ sugar_context: '', sugar_value: '' });
    setRecordedAt({
      date: formatLocalValue(new Date()),
      time: formatLocalTime(new Date()),
    });

    toast({
      title: "Metric Logged",
      description: "Health data recorded successfully.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">Log Health Metric</DialogTitle>
          <p className="text-sm text-muted-foreground text-center">Record accurate readings to monitor your wellness trends.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Blood Pressure (optional)</Label>
                <span className="text-xs text-muted-foreground">Provide all three values</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="systolic" className="text-sm">Systolic</Label>
                  <Input
                    id="systolic"
                    type="number"
                    min={0}
                    value={profileData.systolic}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, systolic: e.target.value }))}
                    placeholder="120"
                  />
                </div>
                <div>
                  <Label htmlFor="diastolic" className="text-sm">Diastolic</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    min={0}
                    value={profileData.diastolic}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, diastolic: e.target.value }))}
                    placeholder="80"
                  />
                </div>
                <div>
                  <Label htmlFor="heartbeat" className="text-sm">Heartbeat</Label>
                  <Input
                    id="heartbeat"
                    type="number"
                    min={0}
                    value={profileData.heartbeat}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, heartbeat: e.target.value }))}
                    placeholder="72"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Blood Sugar (optional)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sugar_context" className="text-sm">Context</Label>
                  <Select
                    value={sugarData.sugar_context}
                    onValueChange={(value) => setSugarData((prev) => ({ ...prev, sugar_context: value }))}
                  >
                    <SelectTrigger id="sugar_context">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fasting">Fasting</SelectItem>
                      <SelectItem value="after_food">After Food</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sugar_value" className="text-sm">Value (mg/dL)</Label>
                  <Input
                    id="sugar_value"
                    type="number"
                    min={0}
                    value={sugarData.sugar_value}
                    onChange={(e) => setSugarData((prev) => ({ ...prev, sugar_value: e.target.value }))}
                    placeholder="95"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-base font-medium">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={recordedAt.date}
                  onChange={(e) => setRecordedAt((prev) => ({ ...prev, date: e.target.value }))}
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-base font-medium">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={recordedAt.time}
                  onChange={(e) => setRecordedAt((prev) => ({ ...prev, time: e.target.value }))}
                  className="mt-2"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="btn-medical flex-1">
              Log Metric
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}