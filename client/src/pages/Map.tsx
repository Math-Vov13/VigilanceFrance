import { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { IncidentMap } from '../components/map/IncidentMap';
import { IncidentSidebar } from '../components/map/IncidentSidebar';
import { IncidentFilters } from '../components/map/IncidentFilters';
import { Incident, IncidentType } from '../types';
import { incidentTypes } from '../constants/constants';
import { Badge } from '../components/ui/badge';
import { Filter, X, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Button } from '../components/ui/button';
import { mapsApi } from '../services/api';
import { useToast } from '@/components/ui/use-toast';



export default function MapPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [incidentTypeFilter, setIncidentTypeFilter] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchIncidents = useCallback(async (typeFilter: IncidentType | undefined = undefined) => {
    try {
      setIsLoading(true);
      const incidentData = await mapsApi.getIncidents(typeFilter);
      setIncidents(incidentData || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
      setError('Impossible de charger les incidents. Veuillez réessayer plus tard.');
      setIncidents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);
  
  const getActiveFilterLabel = useMemo(() => (filterType: string) => {
    if (filterType === 'all') return 'Tous les incidents';
    const incidentType = incidentTypes.find(type => type.value === filterType);
    return incidentType?.label ?? 'Tous les incidents';
  }, []);
  
  const handleMarkerClick = useCallback((incident: Incident) => {
    setSelectedIncident(incident);
    setSidebarOpen(true);
  }, []);
  
  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
    setSelectedIncident(null);
  }, []);
  
  const handleFilterChange = useCallback((value: string) => {
    setIncidentTypeFilter(value);
    fetchIncidents(value as IncidentType);
  }, [fetchIncidents]);

  const handleAddIncident = useCallback(async (newIncident: Omit<Incident, 'id' | 'comments'>) => {
    try {
      setIsLoading(true);
      const incident = await mapsApi.createIncident(newIncident);
      setIncidents(prev => [...prev, incident]);
      setError(null);
      
      toast({
        title: "Incident créé",
        description: "L'incident a été ajouté avec succès.",
        variant: "default"
      });
    } catch (err) {
      console.error('Failed to create incident:', err);
      setError('Impossible de créer l\'incident. Veuillez réessayer plus tard.');
      
      toast({
        title: "Erreur",
        description: "Impossible de créer l'incident. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const handleUpvote = useCallback(async (incidentId: string) => {
    try {
      const response = await mapsApi.addVote(incidentId);
      const { vote_id } = response;
      
      if (!vote_id) {
        throw new Error('No vote_id returned from the API');
      }
      
      setIncidents(prevIncidents => 
        prevIncidents.map(incident => {
          if (incident.id === incidentId) {
            return {
              ...incident,
              upvotes: (incident.upvotes ?? 0) + 1
            };
          }
          return incident;
        })
      );
      
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident({
          ...selectedIncident,
          upvotes: (selectedIncident.upvotes ?? 0) + 1
        });
      }
      
      toast({
        title: "Vote enregistré",
        description: "Votre vote a été enregistré avec succès.",
        variant: "default"
      });
    } catch (err) {
      console.error('Failed to upvote incident:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre vote. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [selectedIncident, toast]);
  
  const handleMarkAsSolved = useCallback(async (incidentId: string) => {
    try {
      const result = await mapsApi.markAsSolved(incidentId);
      
      if (result && result.solved) {
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
        
        toast({
          title: "Incident résolu",
          description: "L'incident a été marqué comme résolu.",
          variant: "default"
        });
      }
    } catch (err) {
      console.error('Failed to mark as solved:', err);
      toast({
        title: "Erreur",
        description: "Impossible de marquer l'incident comme résolu. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [selectedIncident, toast]);
  
  const handleLikeComment = useCallback(async (incidentId: string, commentId: string) => {
    try {
      await mapsApi.likeComment(incidentId, commentId);
    } catch (err) {
      console.error('Failed to like comment:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'aimer ce commentaire. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  const handleReportComment = useCallback(async (incidentId: string, commentId: string) => {
    try {
      await mapsApi.reportComment(incidentId, commentId);
      toast({
        title: "Commentaire signalé",
        description: "Le commentaire a été signalé aux modérateurs. Merci de votre vigilance!",
        variant: "default"
      });
    } catch (err) {
      console.error('Failed to report comment:', err);
      toast({
        title: "Erreur",
        description: "Impossible de signaler ce commentaire. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  const safeIncidents = incidents ?? [];
  
  const countByType = useMemo(() => 
    incidentTypes.map(type => ({
      ...type,
      count: safeIncidents.filter(incident => incident?.type === type.value).length
    })), 
  [safeIncidents]);
  
  if (isLoading && (!incidents || incidents.length === 0)) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Navbar showSearch={false} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Chargement des incidents...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error && (!incidents || incidents.length === 0)) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Navbar showSearch={false} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4 border border-destructive/30">
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
    <div className="h-screen flex flex-col bg-background">
      <Navbar showSearch />
      
      <div className="flex-grow flex relative pt-16">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block w-80 bg-card border-r border-border overflow-auto">
          <div className="p-4 sticky top-0">
            <IncidentFilters 
              selectedType={incidentTypeFilter} 
              onChange={handleFilterChange}
              counts={countByType} 
            />
          </div>
        </div>
        
        {/* Mobile filters */}
        <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-card border-b border-border px-4 py-2 flex items-center justify-between shadow-sm">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 pt-12 bg-card">
              <div className="px-1">
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
        
        {/* Incident details sidebar */}
        {sidebarOpen && selectedIncident && (
          <div className="absolute md:relative right-0 top-0 bottom-0 w-full md:w-96 z-20 max-h-screen overflow-hidden">
            <IncidentSidebar 
              incident={selectedIncident}
              onClose={handleSidebarClose}
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