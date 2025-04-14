import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/use-toast';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  MoreVertical,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { Incident } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { sampleIncidents } from '../../data/sampleData';

export function AdminIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>(sampleIncidents);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedIncidents, setSelectedIncidents] = useState<number[]>([]);
  
  const { toast } = useToast();
  
  // Filter incidents based on search query and filters
  const filteredIncidents = incidents.filter(incident => {
    // Search filter
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === 'all' || incident.type === typeFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    
    // Severity filter
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesSeverity;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'Pp', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
  // Handle selecting all incidents
  const handleSelectAll = () => {
    if (selectedIncidents.length === filteredIncidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(filteredIncidents.map(incident => incident.id));
    }
  };
  
  // Handle selecting individual incident
  const handleSelectIncident = (id: number) => {
    if (selectedIncidents.includes(id)) {
      setSelectedIncidents(selectedIncidents.filter(incidentId => incidentId !== id));
    } else {
      setSelectedIncidents([...selectedIncidents, id]);
    }
  };
  
  // Verify an incident
  const handleVerifyIncident = (id: number) => {
    setIncidents(incidents.map(incident => 
      incident.id === id
        ? { 
            ...incident, 
            status: 'verified', 
            verifiedBy: 'Admin', 
            verifiedDate: new Date().toISOString() 
          }
        : incident
    ));
    
    toast({
      title: 'Incident vérifié',
      description: 'L\'incident a été marqué comme vérifié.',
    });
  };
  
  // Mark an incident as resolved
  const handleResolveIncident = (id: number) => {
    setIncidents(incidents.map(incident => 
      incident.id === id
        ? { ...incident, status: 'resolved' }
        : incident
    ));
    
    toast({
      title: 'Incident résolu',
      description: 'L\'incident a été marqué comme résolu.',
    });
  };
  
  // Delete an incident
  const handleDeleteIncident = (id: number) => {
    setIncidents(incidents.filter(incident => incident.id !== id));
    setSelectedIncidents(selectedIncidents.filter(incidentId => incidentId !== id));
    
    toast({
      title: 'Incident supprimé',
      description: 'L\'incident a été supprimé avec succès.',
    });
  };
  
  // Handle bulk actions
  const handleBulkAction = (action: 'verify' | 'resolve' | 'delete') => {
    if (selectedIncidents.length === 0) return;
    
    switch (action) {
      case 'verify':
        setIncidents(incidents.map(incident => 
          selectedIncidents.includes(incident.id)
            ? { 
                ...incident, 
                status: 'verified', 
                verifiedBy: 'Admin', 
                verifiedDate: new Date().toISOString() 
              }
            : incident
        ));
        toast({
          title: 'Incidents vérifiés',
          description: `${selectedIncidents.length} incidents ont été marqués comme vérifiés.`,
        });
        break;
      
      case 'resolve':
        setIncidents(incidents.map(incident => 
          selectedIncidents.includes(incident.id)
            ? { ...incident, status: 'resolved' }
            : incident
        ));
        toast({
          title: 'Incidents résolus',
          description: `${selectedIncidents.length} incidents ont été marqués comme résolus.`,
        });
        break;
      
      case 'delete':
        setIncidents(incidents.filter(incident => !selectedIncidents.includes(incident.id)));
        toast({
          title: 'Incidents supprimés',
          description: `${selectedIncidents.length} incidents ont été supprimés.`,
        });
        break;
    }
    
    setSelectedIncidents([]);
  };
  
  // Get severity badge styling
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'mineur':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Mineur</Badge>;
      case 'moyen':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Moyen</Badge>;
      case 'majeur':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Majeur</Badge>;
      case 'critique':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Critique</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  // Get status badge styling
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Vérifié</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Résolu</Badge>;
      case 'unverified':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Non vérifié</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestion des Incidents</h1>
        <p className="text-gray-500">Consultez, vérifiez et modérez les incidents signalés</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Liste des incidents</CardTitle>
              <CardDescription>
                {filteredIncidents.length} incidents sur {incidents.length} au total
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedIncidents.length > 0 && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('verify')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Vérifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('resolve')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Résoudre
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => handleBulkAction('delete')}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </>
              )}
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par titre, description ou lieu..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-1 flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="accident">Accident</SelectItem>
                  <SelectItem value="inondation">Inondation</SelectItem>
                  <SelectItem value="incendie">Incendie</SelectItem>
                  <SelectItem value="vol">Vol</SelectItem>
                  <SelectItem value="agression">Agression</SelectItem>
                  <SelectItem value="manifestation">Manifestation</SelectItem>
                  <SelectItem value="panne">Panne</SelectItem>
                  <SelectItem value="pollution">Pollution</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">En cours</SelectItem>
                  <SelectItem value="verified">Vérifié</SelectItem>
                  <SelectItem value="resolved">Résolu</SelectItem>
                  <SelectItem value="unverified">Non vérifié</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Gravité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les gravités</SelectItem>
                  <SelectItem value="mineur">Mineur</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="majeur">Majeur</SelectItem>
                  <SelectItem value="critique">Critique</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="ml-auto" onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setStatusFilter('all');
                setSeverityFilter('all');
              }}>
                Réinitialiser
              </Button>
            </div>
          </div>
          
          {/* Incidents Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={
                        filteredIncidents.length > 0 && 
                        selectedIncidents.length === filteredIncidents.length
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Sélectionner tous les incidents"
                    />
                  </TableHead>
                  <TableHead>Incident</TableHead>
                  <TableHead className="hidden md:table-cell">Lieu</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Gravité</TableHead>
                  <TableHead className="hidden sm:table-cell">Statut</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <AlertTriangle className="h-8 w-8 mb-2" />
                        <p>Aucun incident trouvé</p>
                        <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedIncidents.includes(incident.id)}
                          onCheckedChange={() => handleSelectIncident(incident.id)}
                          aria-label={`Sélectionner l'incident ${incident.title}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium truncate max-w-xs">{incident.title}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            Signalé par {incident.reportedBy}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500 flex-shrink-0" />
                          <span className="truncate max-w-xs">{incident.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500 flex-shrink-0" />
                          <span>{formatDate(incident.date)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getSeverityBadge(incident.severity)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getStatusBadge(incident.status)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleVerifyIncident(incident.id)}
                              disabled={incident.status === 'verified'}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marquer comme vérifié
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleResolveIncident(incident.id)}
                              disabled={incident.status === 'resolved'}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marquer comme résolu
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteIncident(incident.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination (simplified for demo) */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Affichage de <strong>1-{filteredIncidents.length}</strong> sur <strong>{incidents.length}</strong> incidents
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>Précédent</Button>
              <Button variant="outline" size="sm" disabled>Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}