import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { Incident } from '../../types';
import { Spinner } from '../ui/spinner';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 46.603354, // Centre de la France approximatif
  lng: 1.888334
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: true,
  fullscreenControl: true,
};

type IncidentMapProps = {
  incidents: Incident[];
  onMarkerClick: (incident: Incident) => void;
  filteredType: string;
};

export function IncidentMap({ 
  incidents, 
  onMarkerClick, 
  filteredType 
}: IncidentMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          map.setCenter(location);
          map.setZoom(10);
        },
        () => {
          // If user denies location, keep default center
          console.log("Geolocation permission denied");
        }
      );
    }
  }, []);
  
  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);
  
  const filteredIncidents = filteredType === 'all' 
    ? incidents 
    : incidents.filter(incident => incident.type === filteredType);
  
  if (loadError) return <div>Erreur de chargement de la carte</div>;
  if (!isLoaded) return <div className="h-full flex items-center justify-center"><Spinner /></div>;
  
  return (
    <div className="h-full w-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={6}
        options={options}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
      >
        {/* User's location marker */}
        {userLocation && (
          <MarkerF
            position={userLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(32, 32),
            }}
          />
        )}
        
        {/* Incident markers */}
        {filteredIncidents.map((incident) => (
          <MarkerF
            key={incident.id}
            position={incident.coordinates}
            onClick={() => onMarkerClick(incident)}
            icon={{
              url: getMarkerIconByType(incident.type, incident.severity),
              scaledSize: new google.maps.Size(30, 30),
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

// Helper function to get marker icon based on incident type and severity
function getMarkerIconByType(type: string, severity: string): string {
  const basePath = 'https://maps.google.com/mapfiles/ms/icons/';
  
  switch (severity) {
    case 'majeur':
      return `${basePath}red-dot.png`;
    case 'moyen':
      return `${basePath}orange-dot.png`;
    case 'mineur':
      return `${basePath}yellow-dot.png`;
    default:
      return `${basePath}red-dot.png`;
  }
}