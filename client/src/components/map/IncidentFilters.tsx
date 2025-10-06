import * as React from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
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

  const allIncidentTypes = [
    { value: 'all', label: 'Tous les incidents', icon: 'map-pin', color: '#6B7280' },
    ...incidentTypes
  ];

  return (
    <div className="glass-card-dark rounded-xl overflow-hidden shadow-xl">
      {/* Header with gradient */}
      <div className="px-5 py-4 gradient-navbar border-b border-gray-800">
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Type d'incident
        </h3>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <RadioGroup
          value={selectedType}
          onValueChange={onChange}
          className="space-y-2"
        >
          {allIncidentTypes.map((type) => {
            const count = counts?.find(c => c.value === type.value)?.count || 0;
            const isSelected = selectedType === type.value;
            
            return (
              <div 
                key={type.value} 
                className={`
                  flex items-center space-x-3 p-3 rounded-lg 
                  transition-all duration-200 cursor-pointer group
                  ${isSelected 
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 glow-blue' 
                    : 'hover:bg-gray-800/50 border border-transparent'
                  }
                `}
                onClick={() => onChange(type.value)}
              >
                <RadioGroupItem 
                  value={type.value} 
                  id={`incident-type-${type.value}`}
                  className={isSelected ? 'border-blue-400' : 'border-gray-600'}
                />
                <Label
                  htmlFor={`incident-type-${type.value}`}
                  className="flex items-center justify-between cursor-pointer text-sm flex-1"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className={`transition-all duration-200 ${
                        isSelected ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                      style={{ color: isSelected ? type.color : '#9CA3AF' }}
                    >
                      {type.value === 'all' ? <MapPin className="h-4 w-4" /> : getIconComponent(type.icon)}
                    </span>
                    <span className={`font-medium transition-colors ${
                      isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {type.label}
                    </span>
                  </div>
                  {count > 0 && (
                    <span className={`
                      ml-2 px-2.5 py-0.5 text-xs rounded-full font-semibold
                      transition-all duration-200
                      ${isSelected 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-gray-800 text-gray-300 group-hover:bg-gray-700'
                      }
                    `}>
                      {count}
                    </span>
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
}