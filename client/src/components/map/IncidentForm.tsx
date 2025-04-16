import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { incidentTypes, severityLevels } from '../../constants/constants';
import { Incident, Coordinates, IncidentType, IncidentSeverity } from '../../types';
import { MapPin, AlertCircle } from 'lucide-react';

interface IncidentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (incident: Omit<Incident, 'id' | 'comments'>) => void;
  initialCoordinates?: Coordinates;
  initialType?: IncidentType;
  initialSeverity?: IncidentSeverity;
  initialAddress?: string;
}

export function IncidentForm({ 
  open, 
  onClose, 
  onSubmit, 
  initialCoordinates,
  initialSeverity,
  initialType, 
  initialAddress = '' 
}: IncidentFormProps) {
  const [formData, setFormData] = useState<Omit<Incident, 'id' | 'comments'>>({
    type: initialType || incidentTypes[0].value,
    title: '',
    description: '',
    location: '',
    coordinates: initialCoordinates || { lat: 0, lng: 0 },
    severity: initialSeverity || severityLevels[0].value
  });

  useEffect(() => {
    if (initialAddress) {
      setFormData(prev => ({ ...prev, location: initialAddress }));
    }
  }, [initialAddress]);

  useEffect(() => {
    if (initialCoordinates) {
      setFormData(prev => ({ ...prev, coordinates: initialCoordinates }));
    }
  }, [initialCoordinates]);

  const handleChange = (field: keyof typeof formData, value: string | Coordinates) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.length < 6) {
      alert("Le titre doit contenir au moins 6 caractères");
      return;
    }
    
    if (formData.description.length < 6) {
      alert("La description doit contenir au moins 6 caractères");
      return;
    }
    
    if (formData.location.length < 6) {
      alert("L'adresse doit contenir au moins 6 caractères");
      return;
    }
    
    if (formData.type.length < 6) {
      alert("Veuillez sélectionner un type d'incident valide");
      return;
    }
    if (formData.severity.length < 6) {
      setFormData(prev => ({ ...prev, severity: 'moyen' }));
    }
    
    onSubmit({
      ...formData,
      coordinates: formData.coordinates || { lat: 0, lng: 0 },
    });
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
            <Label className="block text-sm font-medium mb-1">Type d'incident</Label>
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
            <Label className="block text-sm font-medium mb-1">Titre</Label>
            <Input
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Titre bref décrivant l'incident (min. 6 caractères)"
              minLength={6}
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">Description</Label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez ce qui s'est passé avec le plus de détails possible (min. 6 caractères)"
              rows={3}
              minLength={6}
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">
              <MapPin className="inline-block w-4 h-4 mr-1" />
              Adresse
            </Label>
            <Input
              required
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Adresse ou lieu précis (min. 6 caractères)"
              minLength={6}
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">
              <AlertCircle className="inline-block w-4 h-4 mr-1" />
              Gravité
            </Label>
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