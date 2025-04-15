import { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { Incident } from '../../types';
import { defaultMapCenter, defaultMapZoom, incidentTypes } from '../../constants/constants';
import { Loader2} from 'lucide-react';
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
    libraries: ['places'], // Ajout de la bibliothèque places pour la géocodification
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Incident | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);
  const [addingIncident, setAddingIncident] = useState(false);
  const [newIncidentCoords, setNewIncidentCoords] = useState(defaultMapCenter);
  const [newIncidentAddress, setNewIncidentAddress] = useState('');
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  
  // Initialiser le géocodeur une fois que l'API est chargée
  useEffect(() => {
    if (isLoaded && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, [isLoaded]);
  
  // Filter incidents based on selected type
  const filteredIncidents = filteredType === 'all' 
    ? incidents 
    : incidents.filter(incident => incident.type === filteredType);
  
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng && geocoderRef.current) {
      const coords = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      
      setNewIncidentCoords(coords);
      
      try {
        const response = await geocoderRef.current.geocode({ location: coords });
        if (response.results && response.results[0]) {
          setNewIncidentAddress(response.results[0].formatted_address);
        } else {
          setNewIncidentAddress('');
        }
      } catch (error) {
        console.error("Erreur de géocodage:", error);
        setNewIncidentAddress('');
      }
      
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
  
  // Get marker icon based on incident type - Memoize this for performance
  const getMarkerIcon = (type: string) => {
    const incidentType = incidentTypes.find(t => t.value === type);
    
    return incidentType ? {
      url: `/icons/${incidentType.icon}.svg`,
      scaledSize: new google.maps.Size(30, 30),
    } : undefined;
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
          console.log('Geolocation permission denied. Using default location.');
        }
      );
    }
  }, []);
  
  // Reset map when filter changes - Optimisé pour ne pas recalculer à chaque rendu
  useEffect(() => {
    if (map && filteredIncidents.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      
      filteredIncidents.forEach(incident => {
        
        bounds.extend(new google.maps.LatLng(
          incident.coordinates.lat,
          incident.coordinates.lng,
        ));
        console.log('incident id:', incident.id);
      });
      
      // Only adjust bounds if we have multiple points
      if (filteredIncidents.length > 1) {
        map.fitBounds(bounds);
      }
    }
  }, [filteredType, map, filteredIncidents.length]);
  
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
            key={incident.id || `${incident.coordinates.lat}-${incident.coordinates.lng}`}
            position={{ 
              lat: incident.coordinates.lat, 
              lng: incident.coordinates.lng, 
            }}
            onClick={() => handleMarkerClick(incident)}
            icon={getMarkerIcon(incident.type)}
            animation={google.maps.Animation.DROP}
          />
        ))};
        
        
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
      
      {/* Add Incident Button - Retirée car nous utilisons le clic sur la carte à la place */}
      
      {/* Incident Form Dialog */}
      {addingIncident && (
        <IncidentForm
          open={addingIncident}
          onClose={() => setAddingIncident(false)}
          onSubmit={handleAddIncident}
          initialCoordinates={newIncidentCoords}
          initialAddress={newIncidentAddress}
        />
      )}
    </div>
  );
}