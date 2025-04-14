import { useState} from 'react';
import { Navbar } from '../components/layout/Navbar';
import { IncidentMap } from '../components/map/IncidentMap';
import { IncidentSidebar } from '../components/map/IncidentSidebar';
import { IncidentFilters } from '../components/map/IncidentFilters';
import { Incident, Comment } from '../types';
import { incidentTypes } from '../constants/constants';
import { Badge } from '../components/ui/badge';
import { Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Button } from '../components/ui/button';

// Import sample data - would be replaced with API calls in a real application
import { sampleIncidents } from '../data/sampleData.ts';

export default function MapPage() {
  const [incidents, setIncidents] = useState<Incident[]>(sampleIncidents);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [incidentTypeFilter, setIncidentTypeFilter] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  
  // Handle marker click on map
  const handleMarkerClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setSidebarOpen(true);
  };
  
  // Close sidebar
  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedIncident(null);
  };
  
  // Handle filter change
  const handleFilterChange = (value: string) => {
    setIncidentTypeFilter(value);
  };
  
  // Add new incident
  const handleAddIncident = (newIncident: Omit<Incident, 'id' | 'comments'>) => {
    const newId = Math.max(...incidents.map(i => i.id), 0) + 1;
    
    const incident: Incident = {
      ...newIncident,
      id: newId,
      comments: [],
      status: 'unverified',
      upvotes: 0,
      downvotes: 0
    };
    
    setIncidents(prev => [...prev, incident]);
    // Here you would also send to your API
  };
  
  // Add comment to an incident
  const handleAddComment = (incidentId: number, comment: Omit<Comment, 'id' | 'date'>) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => {
        if (incident.id === incidentId) {
          const newComment: Comment = {
            ...comment,
            id: Math.max(...incident.comments.map(c => c.id), 0) + 1,
            date: new Date().toISOString()
          };
          
          return {
            ...incident,
            comments: [...incident.comments, newComment]
          };
        }
        return incident;
      })
    );
    
    // Update the selected incident if it's the one we just added a comment to
    if (selectedIncident && selectedIncident.id === incidentId) {
      const updatedIncident = incidents.find(i => i.id === incidentId);
      if (updatedIncident) {
        setSelectedIncident(updatedIncident);
      }
    }
  };
  
  // Get active filter label for mobile display
  const getActiveFilterLabel = () => {
    if (incidentTypeFilter === 'all') return 'Tous les incidents';
    const type = incidentTypes.find(t => t.value === incidentTypeFilter);
    return type ? type.label : 'Inconnu';
  };
  
  // Like a comment
  const handleLikeComment = (incidentId: number, commentId: number) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            comments: incident.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: (comment.likes || 0) + 1
                };
              }
              return comment;
            })
          };
        }
        return incident;
      })
    );
  };
  
  // Report a comment
  const handleReportComment = (incidentId: number, commentId: number) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            comments: incident.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  reported: true
                };
              }
              return comment;
            })
          };
        }
        return incident;
      })
    );
    
    // In a real app, you would send this to your API
    alert('Commentaire signalé aux modérateurs. Merci de votre vigilance!');
  };
  
  // Count incidents by type for the filter badges
  const countByType = incidentTypes.map(type => ({
    ...type,
    count: incidents.filter(incident => incident.type === type.value).length
  }));
  
  return (
    <div className="h-screen flex flex-col">
      <Navbar showSearch />
      
      <div className="flex-grow flex relative">
        {/* Desktop filters sidebar */}
        <div className="hidden md:block w-64 p-4 bg-gray-50 border-r border-gray-200 overflow-auto">
          <div className="sticky top-0">
            <h2 className="text-lg font-semibold mb-4">Filtres</h2>
            <IncidentFilters 
              selectedType={incidentTypeFilter} 
              onChange={handleFilterChange}
              counts={countByType} 
            />
          </div>
        </div>
        
        {/* Mobile filters button and current selection */}
        <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 pt-12">
              <div className="px-1">
                <h2 className="text-lg font-semibold mb-4">Filtres</h2>
                <IncidentFilters 
                  selectedType={incidentTypeFilter} 
                  onChange={(value) => {
                    handleFilterChange(value);
                    setMobileFiltersOpen(false);
                  }}
                  counts={countByType}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          {incidentTypeFilter !== 'all' && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFilterLabel()}
              <button
                className="ml-1"
                onClick={() => handleFilterChange('all')}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
        
        {/* Main map area */}
        <div className="flex-grow relative">
          <IncidentMap 
            incidents={incidents} 
            onMarkerClick={handleMarkerClick}
            filteredType={incidentTypeFilter}
            onAddIncident={handleAddIncident}
          />
        </div>
        
        {/* Incident details sidebar - conditionally rendered */}
        {sidebarOpen && selectedIncident && (
          <div className="absolute md:relative right-0 top-0 bottom-0 w-full md:w-96 z-20 max-h-screen overflow-hidden">
            <IncidentSidebar 
              incident={selectedIncident} 
              onClose={handleSidebarClose}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onReportComment={handleReportComment}
            />
          </div>
        )}
      </div>
    </div>
  );
}