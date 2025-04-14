import { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { Incident } from '../../types';
import { defaultMapCenter, defaultMapZoom, incidentTypes } from '../../constants/constants';
import { Button } from '../ui/button';
import { Loader2, Plus } from 'lucide-react';
import { IncidentForm } from './IncidentForm';

interface IncidentMapProps {
  incidents: Incident[];
  onMarkerClick: (incident: Incident) => void;
  filteredType: string;
  onAddIncident?: (incident: Omit<Incident, 'id' | 'comments'>) => void;
}

export function IncidentMap({ 
  incidents, 
  onMarkerClick, 
  filteredType,
  onAddIncident 
}: IncidentMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Incident | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);
  const [addingIncident, setAddingIncident] = useState(false);
  const [newIncidentCoords, setNewIncidentCoords] = useState(defaultMapCenter);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Filter incidents based on selected type
  const filteredIncidents = filteredType === 'all' 
    ? incidents 
    : incidents.filter(incident => incident.type === filteredType);
  
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setNewIncidentCoords({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
      setAddingIncident(true);
    }
  };
  
  const handleMarkerClick = (incident: Incident) => {
    setSelectedMarker(incident);
    setTimeout(() => {
      onMarkerClick(incident);
      setSelectedMarker(null);
    }, 200);
  };
  
  const handleAddIncident = (incident: Omit<Incident, 'id' | 'comments'>) => {
    if (onAddIncident) {
      onAddIncident(incident);
    }
    setAddingIncident(false);
  };
  
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMap(map);
  };
  
  // Get marker icon based on incident type
  const getMarkerIcon = (type: string) => {
    const incidentType = incidentTypes.find(t => t.value === type);
    if (!incidentType) return defaultIcon;
    
    return {
      url: `/icons/${incidentType.icon}.svg`,
      scaledSize: new google.maps.Size(30, 30),
    };
  };
  
  // Update user's location if allowed
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Use default if geolocation fails
          console.log('Geolocation permission denied. Using default location.');
        }
      );
    }
  }, []);
  
  // Reset map when filter changes
  useEffect(() => {
    if (map && filteredIncidents.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      
      filteredIncidents.forEach(incident => {
        bounds.extend(new google.maps.LatLng(
          incident.coordinates.lat,
          incident.coordinates.lng
        ));
      });
      
      // Only adjust bounds if we have multiple points
      if (filteredIncidents.length > 1) {
        map.fitBounds(bounds);
      }
    }
  }, [filteredType, map, filteredIncidents]);
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">Chargement de la carte...</span>
      </div>
    );
  }
  
  return (
    <div className="relative h-full w-full">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={defaultMapZoom}
        onLoad={onMapLoad}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {filteredIncidents.map(incident => (
          <Marker
            key={incident.id}
            position={{ 
              lat: incident.coordinates.lat, 
              lng: incident.coordinates.lng 
            }}
            onClick={() => handleMarkerClick(incident)}
            icon={getMarkerIcon(incident.type)}
            animation={google.maps.Animation.DROP}
          />
        ))}
        
        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.coordinates.lat,
              lng: selectedMarker.coordinates.lng
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold">{selectedMarker.title}</h3>
              <p className="text-sm text-gray-600">{selectedMarker.location}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Add Incident Button */}
      {onAddIncident && (
        <Button
          className="absolute bottom-4 right-4 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          size="lg"
          onClick={() => setAddingIncident(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Signaler
        </Button>
      )}
      
      {/* Incident Form Dialog */}
      {addingIncident && (
        <IncidentForm
          open={addingIncident}
          onClose={() => setAddingIncident(false)}
          onSubmit={handleAddIncident}
          initialCoordinates={newIncidentCoords}
        />
      )}
    </div>
  );
}