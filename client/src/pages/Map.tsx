import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { IncidentMap } from '../components/map/IncidentMap';
import { IncidentSidebar } from '../components/map/IncidentSidebar';
import { IncidentFilters } from '../components/map/IncidentFilters';
import { Incident } from '../types';

// Sample data - this would come from your API
const sampleIncidents: Incident[] = [
  {
    id: 1,
    type: 'accident',
    title: 'Accident de la route',
    description: 'Collision entre deux véhicules sur l\'autoroute A1',
    location: 'Paris, 75001',
    coordinates: { lat: 48.856614, lng: 2.3522219 }, // Paris coordinates
    date: '2025-04-05T14:30:00',
    severity: 'moyen',
    reportedBy: 'Jean D.',
    comments: [
      { id: 1, user: 'Marie L.', text: 'J\'ai été témoin, les secours sont arrivés rapidement', date: '2025-04-05T14:45:00' },
      { id: 2, user: 'Thomas B.', text: 'La circulation a été rétablie vers 16h', date: '2025-04-05T16:15:00' }
    ]
  },
  {
    id: 2,
    type: 'inondation',
    title: 'Inondation rue principale',
    description: 'Suite aux fortes pluies, la rue principale est inondée sur 200m',
    location: 'Lyon, 69002',
    coordinates: { lat: 45.764043, lng: 4.835659 }, // Lyon coordinates
    date: '2025-04-06T08:15:00',
    severity: 'majeur',
    reportedBy: 'Sophie M.',
    comments: [
      { id: 1, user: 'Pierre D.', text: 'Le niveau d\'eau continue de monter', date: '2025-04-06T09:30:00' }
    ]
  },
  {
    id: 3,
    type: 'vol',
    title: 'Vol à l\'arraché',
    description: 'Téléphone portable volé sur la place du marché',
    location: 'Marseille, 13001',
    coordinates: { lat: 43.296482, lng: 5.369780 }, // Marseille coordinates
    date: '2025-04-05T18:45:00',
    severity: 'mineur',
    reportedBy: 'Antoine R.',
    comments: []
  },
  {
    id: 4,
    type: 'agression',
    title: 'Agression dans le métro',
    description: 'Une personne a été agressée à la station République',
    location: 'Paris, 75011',
    coordinates: { lat: 48.867748, lng: 2.362087 }, // Paris République coordinates
    date: '2025-04-04T22:15:00',
    severity: 'moyen',
    reportedBy: 'Sarah L.',
    comments: []
  },
  {
    id: 5,
    type: 'incendie',
    title: 'Incendie dans un immeuble',
    description: 'Un incendie s\'est déclaré au 3ème étage, les pompiers sont sur place',
    location: 'Bordeaux, 33000',
    coordinates: { lat: 44.837789, lng: -0.579180 }, // Bordeaux coordinates
    date: '2025-04-03T14:20:00',
    severity: 'majeur',
    reportedBy: 'Michel D.',
    comments: [
      { id: 1, user: 'Lucie B.', text: 'Tous les habitants ont été évacués', date: '2025-04-03T15:10:00' }
    ]
  }
];

export default function Map() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [incidentTypeFilter, setIncidentTypeFilter] = useState<string>('all');
  
  const handleMarkerClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setSidebarOpen(true);
  };
  
  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedIncident(null);
  };
  
  const handleFilterChange = (value: string) => {
    setIncidentTypeFilter(value);
  };
  
  return (
    <div className="h-screen flex flex-col">
      <Navbar showSearch />
      
      <div className="flex-grow flex relative">
        {/* Left sidebar with filters */}
        <div className="hidden md:block p-4 bg-gray-50">
          <IncidentFilters 
            selectedType={incidentTypeFilter} 
            onChange={handleFilterChange} 
          />
        </div>
        
        {/* Main map area */}
        <div className="flex-grow relative">
          <IncidentMap 
            incidents={sampleIncidents} 
            onMarkerClick={handleMarkerClick}
            filteredType={incidentTypeFilter}
          />
        </div>
        
        {/* Incident details sidebar - conditionally rendered */}
        {sidebarOpen && selectedIncident && (
          <div className="absolute md:relative right-0 top-0 bottom-0 w-full md:w-auto z-10">
            <IncidentSidebar 
              incident={selectedIncident} 
              onClose={handleSidebarClose} 
            />
          </div>
        )}
      </div>
    </div>
  );
}