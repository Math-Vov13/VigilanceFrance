import { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { Incident } from '../../types';
import { defaultMapCenter, defaultMapZoom, incidentTypes } from '../../constants/constants';
import { Loader2 } from 'lucide-react';
import { MapPin, Mountain } from 'lucide-react';
import { IncidentForm } from './IncidentForm';

const GOOGLE_MAPS_LIBRARIES = ['places', 'marker', 'maps3d'];

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
  // Load Google Maps API with beta version and maps3d library
  const { isLoaded } = useJsApiLoader({
  id: 'google-map-script',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'beta',
  libraries: GOOGLE_MAPS_LIBRARIES as any
});

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Incident | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);
  const [is3DMode, setIs3DMode] = useState(false);
  const [addingIncident, setAddingIncident] = useState(false);
  const [newIncidentCoords, setNewIncidentCoords] = useState(defaultMapCenter);
  const [newIncidentAddress, setNewIncidentAddress] = useState(''); 
  
  const map2DRef = useRef<google.maps.Map | null>(null);
  const map3DContainerRef = useRef<HTMLDivElement>(null);
  const map3DElementRef = useRef<any>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const markers3DRef = useRef<any[]>([]);
  
  // Initialize geocoder
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
  const handleAddIncident = (incident: Omit<Incident, 'id' | 'comments'>) => {
    if (onAddIncident) {
      onAddIncident(incident);
    }
    setAddingIncident(false);
  };
  // Initialize 3D map
  useEffect(() => {
  if (!isLoaded || !is3DMode || !map3DContainerRef.current) return;

  // Cleanup old elements
  map3DContainerRef.current.innerHTML = '';

  const map3DElement = document.createElement('gmp-map-3d');
  map3DElement.setAttribute('mode', 'hybrid');
  map3DElement.setAttribute('center', `${mapCenter.lat},${mapCenter.lng}`);
  map3DElement.setAttribute('range', '2000');
  map3DElement.setAttribute('tilt', '75');
  map3DElement.setAttribute('heading', '330');
  map3DElement.style.width = '100%';
  map3DElement.style.height = '100%';

  // Add 3D markers
  filteredIncidents.forEach(incident => {
    if (!incident.coordinates) return;

    const marker3D = document.createElement('gmp-marker-3d');
    marker3D.setAttribute('position', `${incident.coordinates.lat},${incident.coordinates.lng},50`);
    marker3D.addEventListener('gmp-click', () => handleMarkerClick(incident));
    map3DElement.appendChild(marker3D);
  });

  map3DContainerRef.current.appendChild(map3DElement);

  map3DElementRef.current = map3DElement;

  return () => {
    map3DContainerRef.current!.innerHTML = '';
    map3DElementRef.current = null;
  };
}, [isLoaded, is3DMode, mapCenter, filteredIncidents]);
  
  // Add 3D markers
  const addMarkers3D = async (map3D: any) => {
    const googleMaps: any = window.google?.maps;
    if (!googleMaps || !googleMaps.Marker3DElement) {
      console.error('CRITICAL: Marker3DElement not found.');
      return; 
    }
    try {
      const Marker3DElement = googleMaps.Marker3DElement;
      
      // Clear existing markers
      markers3DRef.current.forEach(marker => {
        try {
          map3D.removeChild(marker);
        } catch (e) {
          // Marker already removed
        }
      });
      markers3DRef.current = [];
      
      // Add new markers
      filteredIncidents
        .filter(incident => 
          incident?.coordinates && 
          typeof incident.coordinates.lat === 'number' && 
          typeof incident.coordinates.lng === 'number'
        )
        .forEach(incident => {
          const marker = new Marker3DElement({
            position: {
              lat: incident.coordinates.lat,
              lng: incident.coordinates.lng,
              altitude: 50, // Height above ground
            },
            altitudeMode: 'relativeToGround',
          });
          
          marker.addEventListener('gmp-click', () => {
            handleMarkerClick(incident);
          });
          
          map3D.appendChild(marker);
          markers3DRef.current.push(marker);
        });
    } catch (error) {
      console.error('Error adding 3D markers:', error);
    }
  };
  
  // Update 3D markers when incidents change
  useEffect(() => {
    if (is3DMode && map3DElementRef.current) {
      addMarkers3D(map3DElementRef.current);
    }
  }, [filteredIncidents, is3DMode]);
  
  const handleMarkerClick = (incident: Incident) => {
    setSelectedMarker(incident);
    setTimeout(() => {
      onMarkerClick(incident);
      setSelectedMarker(null);
    }, 200);
  };
  
  const onMapLoad = (map: google.maps.Map) => {
    map2DRef.current = map;
    setMap(map);
  };
  
  // Get marker icon for 2D map
  const getMarkerIcon = (type: string) => {
    const incidentType = incidentTypes.find(t => t.value === type);
    
    return incidentType ? {
      url: `/icons/${incidentType.icon}.svg`,
      scaledSize: new google.maps.Size(30, 30),
    } : undefined;
  };
  
  // Get user's location
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
  
  // Toggle between 2D and 3D
  const handleToggle3D = () => {
    setIs3DMode(!is3DMode);
  };
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-700">Chargement de la carte...</span>
      </div>
    );
  }
  
  return (
    <div className="relative h-full w-full">
      {/* 2D Map */}
      <div className={`absolute inset-0 ${is3DMode ? 'hidden' : 'block'}`}>
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
          {filteredIncidents
            .filter(incident => 
              incident?.coordinates && 
              typeof incident.coordinates.lat === 'number' && 
              typeof incident.coordinates.lng === 'number'
            )
            .map(incident => (
              <Marker
                key={incident.id || `${incident.coordinates.lat}-${incident.coordinates.lng}`}
                position={{ 
                  lat: incident.coordinates.lat, 
                  lng: incident.coordinates.lng, 
                }}
                onClick={() => handleMarkerClick(incident)}
                icon={getMarkerIcon(incident.type)}
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
      </div>
      
      {/* 3D Map Container */}
      <div 
        ref={map3DContainerRef}
        className={`absolute inset-0 ${is3DMode ? 'block' : 'hidden'}`}
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* 2D/3D Toggle Button */}
      <button
        onClick={handleToggle3D}
        className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
        title={is3DMode ? 'Passer en 2D' : 'Passer en 3D'}
      >
        {is3DMode ? (
          <>
            <MapPin className="w-5 h-5" />
            <span className="hidden sm:inline">Vue 2D</span>
          </>
        ) : (
          <>
            <Mountain className="w-5 h-5" />
            <span className="hidden sm:inline">Vue 3D</span>
          </>
        )}
      </button>
      
      {/* Mode indicator */}
      <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
        {is3DMode ? '3D Photorealistic' : '2D Standard'}
      </div>
    </div>
  );
}