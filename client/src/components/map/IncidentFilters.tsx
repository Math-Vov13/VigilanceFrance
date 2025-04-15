import * as React from 'react';

import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  AlertCircle, 
  Droplets, 
  AlertTriangle, 
  Flame,  
  MapPin,
  Users,
  CloudOff,
  ZapOff,
  ShieldOff
} from 'lucide-react';
import { incidentTypes } from '../../constants/constants';

type IncidentFiltersProps = {
  selectedType: string;
  onChange: (value: string) => void;
  counts: { count: number; value: string; label: string; color: string; icon: string; }[]
};

export function IncidentFilters({ selectedType, onChange, counts }: IncidentFiltersProps) {
  // Map icon strings to actual Lucide icon components
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      'car-crash': <AlertCircle className="h-4 w-4" />,
      'droplet': <Droplets className="h-4 w-4" />,
      'flame': <Flame className="h-4 w-4" />,
      'shield-off': <ShieldOff className="h-4 w-4" />,
      'alert-triangle': <AlertTriangle className="h-4 w-4" />,
      'users': <Users className="h-4 w-4" />,
      'zap-off': <ZapOff className="h-4 w-4" />,
      'cloud-off': <CloudOff className="h-4 w-4" />,
      'alert-circle': <AlertCircle className="h-4 w-4" />
    };
    
    return iconMap[iconName] || <AlertCircle className="h-4 w-4" />;
  };

  // Add "All incidents" option to the top of the list
  const allIncidentTypes = [
    { value: 'all', label: 'Tous les incidents', icon: 'map-pin', color: '#000000' },
    ...incidentTypes
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
          {allIncidentTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem value={type.value} id={`incident-type-${type.value}`} />
              <Label 
                htmlFor={`incident-type-${type.value}`}
                className="flex items-center cursor-pointer text-sm"
              >
                <span className="mr-2" style={{ color: type.color }}>
                  {type.value === 'all' ? <MapPin className="h-4 w-4" /> : getIconComponent(type.icon)}
                </span>
                {type.label}
                {counts && counts.find(c => c.value === type.value)?.count > 0 && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({counts.find(c => c.value === type.value)?.count || 0})
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}