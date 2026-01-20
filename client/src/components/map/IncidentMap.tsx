import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Loader2, Zap, Eye } from 'lucide-react';
import { Incident } from '../../types';
import { defaultMapCenter, defaultMapZoom, incidentTypes } from '../../constants/constants';
import { IncidentForm } from './IncidentForm';

const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'VOTRE_MAP_ID';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface IncidentMapProps {
  incidents: Incident[];
  onMarkerClick: (incident: Incident) => void;
  filteredType: string;
  onAddIncident?: (incident: Omit<Incident, 'id' | 'comments'>) => void;
}

// Custom marker component
function CustomMarker({ incident, onClick }: { incident: Incident; onClick: () => void }) {
  const incidentType = incidentTypes.find(t => t.value === incident.type);
  const color = incidentType?.color;

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer transform transition-all duration-200 hover:scale-110"
      style={{ width: '40px', height: '40px' }}
    >
      <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: color }} />
      <div
        className="absolute inset-0 rounded-full shadow-lg flex items-center justify-center border-2 border-white"
        style={{ backgroundColor: color }}
      >
        <img src={`/icons/${incidentType?.icon || 'alert-circle'}.svg`} alt={incident.type} className="w-5 h-5" />
      </div>
      {incident.severity === 'critique' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
      )}
    </div>
  );
}

// Map content component - handles all map logic
function MapContent({
  incidents,
  onMarkerClick,
  filteredType,
  onAddIncident,
  isRealisticMode,
  onToggleMode,
}: IncidentMapProps & {
  isRealisticMode: boolean;
  onToggleMode: () => void;
}) {
  const map = useMap();
  const [selectedMarker, setSelectedMarker] = useState<Incident | null>(null);
  const [addingIncident, setAddingIncident] = useState(false);
  const [newIncidentCoords, setNewIncidentCoords] = useState(defaultMapCenter);
  const [newIncidentAddress, setNewIncidentAddress] = useState('');
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // Initialize geocoder
  useEffect(() => {
    if (map && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, [map]);

  // Set up map click listener
  useEffect(() => {
    if (!map) return;

    // Remove previous listener if exists
    if (mapClickListenerRef.current) {
      mapClickListenerRef.current.remove();
    }

    // Add new click listener
    mapClickListenerRef.current = map.addListener('click', async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng || !geocoderRef.current) return;

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
        console.error('Erreur de géocodage:', error);
        setNewIncidentAddress('');
      }

      setAddingIncident(true);
    });

    return () => {
      if (mapClickListenerRef.current) {
        mapClickListenerRef.current.remove();
      }
    };
  }, [map]);

  // Apply map mode (2D / Realistic)
  useEffect(() => {
    if (map) {
      if (isRealisticMode) {
        map.setMapTypeId('satellite');
        map.setTilt(45);
        map.setHeading(map.getHeading() || 0);
      } else {
        map.setMapTypeId('roadmap');
        map.setTilt(0);
      }
    }
  }, [isRealisticMode, map]);

  // Filter incidents
  const filteredIncidents =
    filteredType === 'all' ? incidents : incidents.filter(incident => incident.type === filteredType);

  const handleAddIncident = (incident: Omit<Incident, 'id' | 'comments'>) => {
    if (onAddIncident) onAddIncident(incident);
    setAddingIncident(false);
  };

  const handleMarkerClick = (incident: Incident) => {
    setSelectedMarker(incident);
    setTimeout(() => {
      onMarkerClick(incident);
      setSelectedMarker(null);
    }, 200);
  };

  return (
    <>
      {/* Advanced Markers */}
      {filteredIncidents
        .filter(
          incident =>
            incident?.coordinates &&
            typeof incident.coordinates.lat === 'number' &&
            typeof incident.coordinates.lng === 'number'
        )
        .map(incident => (
          <AdvancedMarker
            key={incident.id || `${incident.coordinates.lat}-${incident.coordinates.lng}`}
            position={{
              lat: incident.coordinates.lat,
              lng: incident.coordinates.lng,
            }}
          >
            <CustomMarker incident={incident} onClick={() => handleMarkerClick(incident)} />
          </AdvancedMarker>
        ))}

      {/* Info Window */}
      {selectedMarker && (
        <InfoWindow
          position={{
            lat: selectedMarker.coordinates.lat,
            lng: selectedMarker.coordinates.lng,
          }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="p-2 max-w-xs bg-white rounded-lg">
            <h3 className="font-semibold text-gray-900">{selectedMarker.title}</h3>
            <p className="text-sm text-gray-600">{selectedMarker.location}</p>
          </div>
        </InfoWindow>
      )}

      {/* Incident Form Modal */}
      {addingIncident && (
        <IncidentForm
          open={addingIncident}
          onClose={() => setAddingIncident(false)}
          onSubmit={handleAddIncident}
          initialCoordinates={newIncidentCoords}
          initialAddress={newIncidentAddress}
        />
      )}

      {/* Mode toggle button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onToggleMode}
          className="bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-xl shadow-2xl rounded-xl px-5 py-3 flex items-center gap-3 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 border border-gray-700 group"
        >
          {isRealisticMode ? (
            <>
              <Zap className="w-5 h-5 text-yellow-400 group-hover:animate-pulse" />
              <div className="flex flex-col items-start">
                <span className="text-white font-semibold text-sm">Performance</span>
                <span className="text-gray-400 text-xs">Vue 2D optimisée</span>
              </div>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5 text-blue-400 group-hover:animate-pulse" />
              <div className="flex flex-col items-start">
                <span className="text-white font-semibold text-sm">Réaliste</span>
                <span className="text-gray-400 text-xs">Vue 3D satellite</span>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Mode indicator */}
      <div className="absolute bottom-6 left-6 z-10">
        <div
          className={`
          px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border shadow-lg
          transition-all duration-300
          ${
            isRealisticMode
              ? 'bg-blue-500/20 border-blue-400/50 text-blue-400 glow-blue'
              : 'bg-yellow-500/20 border-yellow-400/50 text-yellow-400'
          }
        `}
        >
          {isRealisticMode ? '🌍 Mode Réaliste' : '⚡ Mode Performance'}
        </div>
      </div>
    </>
  );
}

// Main component
export function IncidentMap({ incidents, onMarkerClick, filteredType, onAddIncident }: IncidentMapProps) {
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);
  const [isRealisticMode, setIsRealisticMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLoading(false);
        },
        () => setIsLoading(false)
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleToggleMode = () => setIsRealisticMode(!isRealisticMode);

  if (!API_KEY) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-center text-white">
          <p className="text-red-400 mb-2">Erreur de configuration</p>
          <p className="text-sm">Clé API Google Maps manquante</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-300">Chargement de la carte...</span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId={MAP_ID}
          defaultCenter={mapCenter}
          defaultZoom={defaultMapZoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          streetViewControl={false}
          mapTypeControl={false}
          fullscreenControl={true}
          zoomControl={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapContent
            incidents={incidents}
            onMarkerClick={onMarkerClick}
            filteredType={filteredType}
            onAddIncident={onAddIncident}
            isRealisticMode={isRealisticMode}
            onToggleMode={handleToggleMode}
          />
        </Map>
      </APIProvider>
    </div>
  );
}