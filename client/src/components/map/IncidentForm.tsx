import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { incidentTypes, severityLevels } from '../../constants/constants';
import { Incident, Coordinates } from '../../types';
import { MapPin, Calendar, AlertCircle } from 'lucide-react';

interface IncidentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (incident: Omit<Incident, 'id' | 'comments'>) => void;
  initialCoordinates?: Coordinates;
}

export function IncidentForm({ open, onClose, onSubmit, initialCoordinates }: IncidentFormProps) {
  const [formData, setFormData] = useState<Omit<Incident, 'id' | 'comments'>>({
    type: '',
    title: '',
    description: '',
    location: '',
    coordinates: initialCoordinates || { lat: 0, lng: 0 },
    date: new Date().toISOString().slice(0, 16),
    severity: 'moyen',
    reportedBy: ''
  });

  const handleChange = (field: keyof typeof formData, value: string | Coordinates) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Signaler un incident</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type d'incident</label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleChange('type', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type d'incident" />
              </SelectTrigger>
              <SelectContent>
                {incidentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <Input
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Titre bref décrivant l'incident"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez ce qui s'est passé avec le plus de détails possible"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <MapPin className="inline-block w-4 h-4 mr-1" />
                Adresse
              </label>
              <Input
                required
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Adresse ou lieu précis"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                <Calendar className="inline-block w-4 h-4 mr-1" />
                Date et heure
              </label>
              <Input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <AlertCircle className="inline-block w-4 h-4 mr-1" />
                Gravité
              </label>
              <Select 
                value={formData.severity} 
                onValueChange={(value) => handleChange('severity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Niveau de gravité" />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Votre nom</label>
              <Input
                required
                value={formData.reportedBy}
                onChange={(e) => handleChange('reportedBy', e.target.value)}
                placeholder="Votre nom ou pseudo"
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Annuler
            </Button>
            <Button type="submit">
              Signaler l'incident
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}