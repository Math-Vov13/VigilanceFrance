import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  AlertCircle, 
  Droplets, 
  AlertTriangle, 
  Flame, 
  Shield, 
  MapPin
} from 'lucide-react';

type IncidentFiltersProps = {
  selectedType: string;
  onChange: (value: string) => void;
};

export function IncidentFilters({ selectedType, onChange }: IncidentFiltersProps) {
  const incidentTypes = [
    { value: 'all', label: 'Tous les incidents', icon: <MapPin className="h-4 w-4" /> },
    { value: 'accident', label: 'Accidents', icon: <AlertCircle className="h-4 w-4" /> },
    { value: 'inondation', label: 'Inondations', icon: <Droplets className="h-4 w-4" /> },
    { value: 'vol', label: 'Vols', icon: <Shield className="h-4 w-4" /> },
    { value: 'agression', label: 'Agressions', icon: <AlertTriangle className="h-4 w-4" /> },
    { value: 'incendie', label: 'Incendies', icon: <Flame className="h-4 w-4" /> },
  ];

  return (
    <Card className="w-64 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Type d'incident</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedType} 
          onValueChange={onChange}
          className="space-y-2"
        >
          {incidentTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem value={type.value} id={`incident-type-${type.value}`} />
              <Label 
                htmlFor={`incident-type-${type.value}`}
                className="flex items-center cursor-pointer text-sm"
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}