import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pill, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicine: any) => void;
  editingMedicine?: any;
}

export default function AddMedicineModal({ isOpen, onClose, onSave, editingMedicine }: AddMedicineModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: editingMedicine?.name || '',
    dosage: editingMedicine?.dosage || '',
    frequency: editingMedicine?.frequency || '',
    totalQuantity: editingMedicine?.totalQuantity || '',
    currentStock: editingMedicine?.currentStock || '',
    threshold: editingMedicine?.threshold || '',
    notes: editingMedicine?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.frequency || !formData.totalQuantity || !formData.currentStock) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all required fields (name, frequency, total quantity, current stock).",
        variant: "destructive",
      });
      return;
    }

    const medicine = {
      id: editingMedicine?.id || Date.now().toString(),
      ...formData,
      totalQuantity: parseInt(formData.totalQuantity) || 0,
      currentStock: parseInt(formData.currentStock) || 0,
      threshold: parseInt(formData.threshold) || 0,
    };

    onSave(medicine);
    setFormData({
      name: '', dosage: '', frequency: '', totalQuantity: '', 
      currentStock: '', threshold: '', notes: ''
    });
    
    toast({
      title: editingMedicine ? "Medicine Updated" : "Medicine Added",
      description: `${formData.name} has been ${editingMedicine ? 'updated' : 'added'} successfully.`,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-light rounded-lg">
              <Pill className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle>
              {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Medicine Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Aspirin"
                className="form-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="dosage" className="text-sm font-medium">
                  Dosage
                </Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => handleChange('dosage', e.target.value)}
                  placeholder="e.g., 500mg (optional)"
                  className="form-input"
                />
              </div>
              <div>
                <Label htmlFor="frequency" className="text-sm font-medium">
                  Frequency *
                </Label>
                <Select value={formData.frequency} onValueChange={(value) => handleChange('frequency', value)}>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="Four times daily">Four times daily</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="totalQuantity" className="text-sm font-medium">
                  Total Pills *
                </Label>
                <Input
                  id="totalQuantity"
                  type="number"
                  value={formData.totalQuantity}
                  onChange={(e) => handleChange('totalQuantity', e.target.value)}
                  placeholder="30"
                  className="form-input"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currentStock" className="text-sm font-medium">
                  Current Stock *
                </Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => handleChange('currentStock', e.target.value)}
                  placeholder="25"
                  className="form-input"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="threshold" className="text-sm font-medium">
                  Low Stock Alert
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  value={formData.threshold}
                  onChange={(e) => handleChange('threshold', e.target.value)}
                  placeholder="5"
                  className="form-input"
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional notes about this medicine..."
                className="form-input resize-none"
                rows={2}
              />
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
              type="submit"
              className="flex-1 btn-medical"
            >
              {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}