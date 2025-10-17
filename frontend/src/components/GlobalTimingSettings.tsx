import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useTimingSettings, useUpdateTimingSettings } from "@/hooks/useApi";

interface GlobalTimingSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimingSettings {
  morning_time: string;
  afternoon_time: string;
  night_time: string;
  enable_morning: boolean;
  enable_afternoon: boolean;
  enable_night: boolean;
  timezone: string;
}

export default function GlobalTimingSettings({ isOpen, onClose }: GlobalTimingSettingsProps) {
  const { toast } = useToast();
  const { data: existingSettings, isLoading: loadingSettings } = useTimingSettings();
  const updateSettings = useUpdateTimingSettings();

  const [settings, setSettings] = useState<TimingSettings>({
    morning_time: "08:00",
    afternoon_time: "14:00",
    night_time: "20:00",
    enable_morning: true,
    enable_afternoon: true,
    enable_night: true,
    timezone: "Asia/Kolkata"
  });

  useEffect(() => {
    if (isOpen && existingSettings) {
      setSettings({
        morning_time: existingSettings.morning_time?.substring(0, 5) || "08:00",
        afternoon_time: existingSettings.afternoon_time?.substring(0, 5) || "14:00",
        night_time: existingSettings.night_time?.substring(0, 5) || "20:00",
        enable_morning: existingSettings.enable_morning ?? true,
        enable_afternoon: existingSettings.enable_afternoon ?? true,
        enable_night: existingSettings.enable_night ?? true,
        timezone: existingSettings.timezone || "Asia/Kolkata"
      });
    }
  }, [isOpen, existingSettings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        morning_time: settings.morning_time + ':00',
        afternoon_time: settings.afternoon_time + ':00',
        night_time: settings.night_time + ':00',
        enable_morning: settings.enable_morning,
        enable_afternoon: settings.enable_afternoon,
        enable_night: settings.enable_night,
        timezone: settings.timezone
      });

      toast({
        title: "Settings Saved",
        description: "Your reminder times have been updated successfully.",
      });

      onClose();
    } catch (error) {
      console.error('Error saving timing settings:', error);
      toast({
        title: "Error",
        description: "Failed to save timing settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: keyof TimingSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-light rounded-lg">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle>
              Reminder Timing Settings
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="text-sm text-muted-foreground mb-4">
            Set your preferred times for morning, afternoon, and night medicine reminders.
            These times will be used for all your medicines.
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(
              [
                { key: 'morning', label: 'Morning', field: 'morning_time', enabledField: 'enable_morning' },
                { key: 'afternoon', label: 'Afternoon', field: 'afternoon_time', enabledField: 'enable_afternoon' },
                { key: 'night', label: 'Night', field: 'night_time', enabledField: 'enable_night' },
              ] as const
            ).map(({ key, label, field, enabledField }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${key}_time`} className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {label} Time
                  </Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${key}_enabled`}
                      checked={settings[enabledField]}
                      onCheckedChange={(checked) =>
                        handleChange(enabledField, Boolean(checked))
                      }
                    />
                    <Label htmlFor={`${key}_enabled`} className="text-xs text-muted-foreground">
                      Enable reminder
                    </Label>
                  </div>
                </div>
                <Input
                  id={`${key}_time`}
                  type="time"
                  value={settings[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="form-input"
                  disabled={!settings[enabledField]}
                />
              </div>
            ))}

            <div>
              <Label htmlFor="timezone" className="text-sm font-medium">
                Timezone
              </Label>
              <select
                id="timezone"
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="form-input"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Asia/Kolkata">India</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateSettings.isPending}
              className="flex-1 btn-medical"
            >
              {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}