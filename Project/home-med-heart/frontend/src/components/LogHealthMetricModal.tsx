import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Heart, Weight, Droplet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogHealthMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metric: any) => void;
}

export default function LogHealthMetricModal({ isOpen, onClose, onSave }: LogHealthMetricModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: "",
    value: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  const getUnitForType = (type: string) => {
    switch (type) {
      case 'blood_pressure': return 'mmHg';
      case 'blood_sugar_fasting':
      case 'blood_sugar_after_food': 
      case 'blood_sugar_random': return 'mg/dL';
      case 'weight': return 'kg';
      default: return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.value) {
      toast({
        title: "Missing Information",
        description: "Please select a metric type and enter a value.",
        variant: "destructive",
      });
      return;
    }

    const newMetric = {
      id: Date.now().toString(),
      type: formData.type as 'blood_pressure' | 'blood_sugar_fasting' | 'blood_sugar_after_food' | 'blood_sugar_random' | 'weight',
      value: formData.value,
      unit: getUnitForType(formData.type),
      date: formData.date,
      time: formData.time,
      trend: "stable" as const,
      status: "normal" as const
    };

    onSave(newMetric);
    
    // Reset form
    setFormData({
      type: "",
      value: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
    });

    toast({
      title: "Metric Logged",
      description: `Your ${formData.type.replace('_', ' ')} has been recorded successfully.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">📊 Log Health Metric</DialogTitle>
          <p className="text-sm text-muted-foreground text-center">Track your health metrics to monitor your progress</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <Label htmlFor="type" className="text-base font-medium">What would you like to track?</Label>
            <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a metric type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blood_pressure">🩺 Blood Pressure</SelectItem>
                <SelectItem value="blood_sugar_fasting">🍯 Blood Sugar - Fasting</SelectItem>
                <SelectItem value="blood_sugar_after_food">🍯 Blood Sugar - After Food</SelectItem>
                <SelectItem value="blood_sugar_random">🍯 Blood Sugar - Random</SelectItem>
                <SelectItem value="weight">⚖️ Weight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="value" className="text-base font-medium">
                {formData.type === 'blood_pressure' ? 'Blood Pressure Reading' :
                 formData.type.startsWith('blood_sugar') ? 'Blood Sugar Level' :
                 formData.type === 'weight' ? 'Weight' : 'Value'}
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder={
                    formData.type === 'blood_pressure' ? '120/80' :
                    formData.type.startsWith('blood_sugar') ? '95' :
                    formData.type === 'weight' ? '70.5' : 'Enter value'
                  }
                  className="flex-1"
                  required
                />
                <div className="bg-muted px-3 py-2 rounded-md flex items-center text-sm font-medium min-w-fit">
                  {getUnitForType(formData.type)}
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
                  value={formData.date}
                  onChange={handleChange}
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
                  value={formData.time}
                  onChange={handleChange}
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
              📊 Log Metric
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}