import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { incidentTypes, severityLevels } from '../../constants/constants';
import { Incident, Coordinates, IncidentType, IncidentSeverity } from '../../types';
import { MapPin, AlertCircle, X, Loader2 } from 'lucide-react';

interface IncidentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (incident: Omit<Incident, 'id' | 'comments'>) => void;
  initialCoordinates?: Coordinates;
  initialType?: IncidentType;
  initialSeverity?: IncidentSeverity;
  initialAddress?: string;
}

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressInputRef = useRef<HTMLDivElement>(null);

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

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (field: keyof typeof formData, value: string | Coordinates) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Fetch address suggestions from Nominatim API
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    setLoadingAddresses(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=fr`
      );
      const data: AddressSuggestion[] = await response.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des adresses:', error);
      setAddressSuggestions([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Handle address input change with debounce
  const handleAddressChange = (value: string) => {
    handleChange('location', value);
    
    // Clear previous timeout
    if ((handleAddressChange as any).timeout) {
      clearTimeout((handleAddressChange as any).timeout);
    }
    
    // Debounce the API call
    (handleAddressChange as any).timeout = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelectAddress = (suggestion: AddressSuggestion) => {
    setFormData(prev => ({
      ...prev,
      location: suggestion.display_name,
      coordinates: {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon)
      }
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 6) {
      newErrors.title = 'Le titre doit contenir au moins 6 caractères';
    }

    if (formData.description.length < 6) {
      newErrors.description = 'La description doit contenir au moins 6 caractères';
    }

    if (formData.location.length < 6) {
      newErrors.location = 'L\'adresse doit contenir au moins 6 caractères';
    }

    if (!formData.type || formData.type.length === 0) {
      newErrors.type = 'Veuillez sélectionner un type d\'incident';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSubmit({
        ...formData,
        coordinates: formData.coordinates || { lat: 0, lng: 0 },
      });
      onClose();
      setFormData({
        type: initialType || incidentTypes[0].value,
        title: '',
        description: '',
        location: '',
        coordinates: initialCoordinates || { lat: 0, lng: 0 },
        severity: initialSeverity || severityLevels[0].value
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card-dark border border-gray-800 shadow-2xl max-w-xl">
        {/* Header */}
        <DialogHeader className="gradient-navbar rounded-t-lg -mx-6 -mt-6 px-6 py-4 mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              Signaler un incident
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-300 text-sm mt-2">
            Aidez-nous à améliorer la sécurité en signalant les incidents observés
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type d'incident */}
          <div>
            <Label className="block text-sm font-semibold text-gray-200 mb-2">
              Type d'incident
            </Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleChange('type', value)}
              required
            >
              <SelectTrigger className="bg-gray-800 border border-gray-700 text-gray-100 hover:border-blue-500 transition-colors">
                <SelectValue placeholder="Sélectionnez un type d'incident" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border border-gray-700 text-gray-100">
                {incidentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className="hover:bg-gray-700">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.type}
              </p>
            )}
          </div>
          
          {/* Titre */}
          <div>
            <Label className="block text-sm font-semibold text-gray-200 mb-2">
              Titre
            </Label>
            <Input
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Titre bref décrivant l'incident (min. 6 caractères)"
              minLength={6}
              maxLength={100}
              className="bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="flex justify-between mt-1">
              {errors.title && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
              <span className="text-gray-500 text-xs ml-auto">
                {formData.title.length}/100
              </span>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <Label className="block text-sm font-semibold text-gray-200 mb-2">
              Description
            </Label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez ce qui s'est passé avec le plus de détails possible (min. 6 caractères)"
              rows={4}
              minLength={6}
              maxLength={500}
              className="bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
              <span className="text-gray-500 text-xs ml-auto">
                {formData.description.length}/500
              </span>
            </div>
          </div>
          
          {/* Adresse with Autocomplete */}
          <div ref={addressInputRef} className="relative">
            <Label className="block text-sm font-semibold text-gray-200 mb-2">
              <MapPin className="inline-block w-4 h-4 mr-2 text-blue-400" />
              Adresse
            </Label>
            <div className="relative">
              <Input
                required
                value={formData.location}
                onChange={(e) => handleAddressChange(e.target.value)}
                onFocus={() => formData.location.length >= 3 && setShowSuggestions(true)}
                placeholder="Entrez une adresse (ex: Paris, Rue de la Paix...)"
                maxLength={150}
                autoComplete="off"
                className="bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {loadingAddresses && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                </div>
              )}
            </div>

            {/* Address Suggestions Dropdown */}
            {showSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectAddress(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 border-b border-gray-700 last:border-b-0 transition-colors flex items-start gap-2"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-sm line-clamp-2">
                        {suggestion.display_name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No suggestions message */}
            {showSuggestions && !loadingAddresses && formData.location.length >= 3 && addressSuggestions.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 p-3">
                <p className="text-gray-400 text-sm text-center">
                  Aucune adresse trouvée
                </p>
              </div>
            )}

            {errors.location && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.location}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-2">
              Coordonnées: {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
            </p>
          </div>
          
          {/* Gravité */}
          <div>
            <Label className="block text-sm font-semibold text-gray-200 mb-2">
              <AlertCircle className="inline-block w-4 h-4 mr-2 text-yellow-400" />
              Niveau de gravité
            </Label>
            <Select 
              value={formData.severity} 
              onValueChange={(value) => handleChange('severity', value)}
            >
              <SelectTrigger className="bg-gray-800 border border-gray-700 text-gray-100 hover:border-blue-500 transition-colors">
                <SelectValue placeholder="Sélectionnez le niveau de gravité" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border border-gray-700 text-gray-100">
                {severityLevels.map(level => (
                  <SelectItem key={level.value} value={level.value} className="hover:bg-gray-700">
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-6 border-t border-gray-700 flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Signalement...
                </span>
              ) : (
                'Signaler l\'incident'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}