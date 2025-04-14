import { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { IncidentMap } from '../components/map/IncidentMap';
import { IncidentSidebar } from '../components/map/IncidentSidebar';
import { IncidentFilters } from '../components/map/IncidentFilters';
import { Incident, Comment } from '../types';
import { incidentTypes } from '../constants/constants';
import { Badge } from '../components/ui/badge';
import { Filter, X, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

export default function MapPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [incidentTypeFilter, setIncidentTypeFilter] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Extraction des données d'API améliorée avec une fonction réutilisable
  const extractIncidentData = useCallback((response: any): Incident[] => {
    if (response?.content && Array.isArray(response.content)) {
      return response.content;
    } else if (response?.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response?.data?.content && Array.isArray(response.data.content)) {
      return response.data.content;
    } else if (Array.isArray(response)) {
      return response;
    } else {
      console.error("Structure de données inattendue:", response);
      return [];
    }
  }, []);
  
  const fetchIncidents = useCallback(async (typeFilter = '') => {
    try {
      setIsLoading(true);
      
      const url = typeFilter && typeFilter !== 'all' 
        ? `${API_GATEWAY_URL}/maps/interactions/issues/show?type=${typeFilter}`
        : `${API_GATEWAY_URL}/maps/interactions/issues/show`;
      
      const response = await axios.get(url, { withCredentials: true });
      const incidentData = extractIncidentData(response.data);
      
      setIncidents(incidentData || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
      setError('Impossible de charger les incidents. Veuillez réessayer plus tard.');
      setIncidents([]);
    } finally {
      setIsLoading(false);
    }
  }, [extractIncidentData]);

  // Charger les incidents au chargement
  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);
  
  // Memoized active filter label
  const getActiveFilterLabel = useMemo(() => (filterType: string) => {
    const filterMap: Record<string, string> = {
      'accident': 'Accidents',
      'inondation': 'Inondations',
      'vol': 'Vols',
      'agression': 'Agressions',
      'incendie': 'Incendies',
    };
    
    return filterMap[filterType] || 'Tous les incidents';
  }, []);
  
  // Handle marker click on map
  const handleMarkerClick = useCallback((incident: Incident) => {
    setSelectedIncident(incident);
    setSidebarOpen(true);
  }, []);
  
  // Close sidebar
  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
    setSelectedIncident(null);
  }, []);
  
  // Handle filter change
  const handleFilterChange = useCallback((value: string) => {
    setIncidentTypeFilter(value);
    fetchIncidents(value);
  }, [fetchIncidents]);

  // Add new incident
  const handleAddIncident = useCallback(async (newIncident: Omit<Incident, 'id' | 'comments'>) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_GATEWAY_URL}/maps/interactions/issues/create`, 
        newIncident,
        { withCredentials: true }
      );
      
      let createdIncident;
      if (response.data?.issue) {
        createdIncident = response.data.issue;
      } else if (response.data?.data) {
        createdIncident = response.data.data;
      } else {
        createdIncident = response.data;
      }
      
      const incident: Incident = {
        ...createdIncident,
        comments: createdIncident.comments || [],
        status: createdIncident.status || 'unverified',
        upvotes: createdIncident.upvotes || 0,
        downvotes: createdIncident.downvotes || 0
      };
      
      setIncidents(prev => [...prev, incident]);
      setError(null);
    } catch (err) {
      console.error('Failed to create incident:', err);
      setError('Impossible de créer l\'incident. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Add comment to an incident
  const handleAddComment = useCallback(async (incidentId: number, comment: Omit<Comment, 'id' | 'date'>) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => {
        if (incident.id === incidentId) {
          const newComment: Comment = {
            ...comment,
            id: Math.max(...(incident.comments?.map(c => c.id) || [0]), 0) + 1,
            date: new Date().toISOString()
          };
          
          return {
            ...incident,
            comments: [...(incident.comments || []), newComment]
          };
        }
        return incident;
      })
    );
    
    if (selectedIncident && selectedIncident.id === incidentId) {
      const updatedIncident = incidents.find(i => i.id === incidentId);
      if (updatedIncident) {
        setSelectedIncident(updatedIncident);
      }
    }
  }, [incidents, selectedIncident]);
  
  // Vote for an incident
  const handleUpvote = useCallback(async (incidentId: number) => {
    try {
      await axios.post(
        `${API_GATEWAY_URL}/maps/interactions/votes/create?issue_id=${incidentId}`,
        {},
        { withCredentials: true }
      );
      
      setIncidents(prevIncidents => 
        prevIncidents.map(incident => {
          if (incident.id === incidentId) {
            return {
              ...incident,
              upvotes: (incident.upvotes || 0) + 1
            };
          }
          return incident;
        })
      );
      
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident({
          ...selectedIncident,
          upvotes: (selectedIncident.upvotes || 0) + 1
        });
      }
    } catch (err) {
      console.error('Failed to upvote:', err);
      setError('Impossible de voter. Veuillez réessayer plus tard.');
    }
  }, [selectedIncident]);
  
  // Mark incident as solved
  const handleMarkAsSolved = useCallback(async (incidentId: number) => {
    try {
      const response = await axios.post(
        `${API_GATEWAY_URL}/maps/interactions/solved/create?issue_id=${incidentId}`,
        {},
        { withCredentials: true }
      );
      
      const result = response.data;
      if (result.solved) {
        setIncidents(prevIncidents => 
          prevIncidents.map(incident => {
            if (incident.id === incidentId) {
              return { ...incident, status: 'resolved' };
            }
            return incident;
          })
        );
        
        if (selectedIncident && selectedIncident.id === incidentId) {
          setSelectedIncident({
            ...selectedIncident,
            status: 'resolved' as Incident['status']
          });
        }
      }
    } catch (err) {
      console.error('Failed to mark as solved:', err);
      setError('Impossible de marquer comme résolu. Veuillez réessayer plus tard.');
    }
  }, [selectedIncident]);
  
  // Like a comment
  const handleLikeComment = useCallback((incidentId: number, commentId: number) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            comments: (incident.comments || []).map(comment => {
              if (comment.id === commentId) {
                return { ...comment, likes: (comment.likes || 0) + 1 };
              }
              return comment;
            })
          };
        }
        return incident;
      })
    );
  }, []);
  
  // Report a comment
  const handleReportComment = useCallback((incidentId: number, commentId: number) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            comments: (incident.comments || []).map(comment => {
              if (comment.id === commentId) {
                return { ...comment, reported: true };
              }
              return comment;
            })
          };
        }
        return incident;
      })
    );
    
    alert('Commentaire signalé aux modérateurs. Merci de votre vigilance!');
  }, []);
  
  const safeIncidents = incidents || [];
  
  // Memoize count by type to prevent unnecessary recalculations
  const countByType = useMemo(() => 
    incidentTypes.map(type => ({
      ...type,
      count: safeIncidents.filter(incident => incident?.type === type.value).length
    })), 
  [safeIncidents]);
  
  if (isLoading && (!incidents || incidents.length === 0)) {
    return (
      <div className="h-screen flex flex-col">
        <Navbar showSearch={false} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" />
            <p className="mt-4 text-gray-600">Chargement des incidents...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error && (!incidents || incidents.length === 0)) {
    return (
      <div className="h-screen flex flex-col">
        <Navbar showSearch={false} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
              <p>{error}</p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Rafraîchir la page
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
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
              {getActiveFilterLabel(incidentTypeFilter)}
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
            incidents={safeIncidents} 
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
              onUpvote={handleUpvote}
              onMarkAsSolved={handleMarkAsSolved}
            />
          </div>
        )}
      </div>
    </div>
  );
}