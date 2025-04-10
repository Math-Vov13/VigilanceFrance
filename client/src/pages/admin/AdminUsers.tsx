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
  MoreVertical,
  Lock,
  Unlock,
  Trash2,
  Shield,
  Mail,
  Calendar,
  Map,
  Users,
  AlertTriangle,
  UserPlus,
  UserCog
} from 'lucide-react';
import { AdminUser, User } from '../../types';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

// Sample user data
const sampleUsers: AdminUser[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    profileImage: '/assets/avatar-1.jpg',
    createdAt: '2025-01-15T10:30:00',
    role: 'user',
    reportedIncidents: [1, 2, 3],
    savedIncidents: [4, 5]
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Laurent',
    email: 'marie.laurent@example.com',
    profileImage: '/assets/avatar-2.jpg',
    createdAt: '2025-01-20T14:45:00',
    role: 'user',
    reportedIncidents: [6],
    savedIncidents: [7, 8, 9]
  },
];

// Interfaces pour la gestion des utilisateurs
interface StatusIndicator {
  active: boolean;
  suspended: boolean;
  banned: boolean;
}

interface UserWithStatus extends User {
  role: 'user' | 'moderator' | 'admin';
  status: StatusIndicator;
}

// Fonction pour obtenir les initiales d'un utilisateur
const getInitials = (name: string) => {
  return name
    .split(/[^a-zA-Z0-9]/)  // Split on non-alphanumeric
    .filter(part => part.length > 0)  // Remove empty strings
    .map(part => part[0])  // Get first character
    .join('')  // Join them
    .toUpperCase()  // Make uppercase
    .substring(0, 2);  // Get up to 2 characters
};

export function AdminUsers() {
  // État pour les utilisateurs avec statut
  const [users, setUsers] = useState<UserWithStatus[]>(
    sampleUsers.map(user => ({
      ...user,
      status: {
        active: true,
        suspended: false,
        banned: false
      }
    }))
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'user',
  });
  
  const { toast } = useToast();
  
  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    // Filtre de recherche
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre de rôle
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    // Filtre de statut
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.status.active) ||
      (statusFilter === 'suspended' && user.status.suspended) ||
      (statusFilter === 'banned' && user.status.banned);
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Formater la date relative
  const formatRelativeDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
  // Formater la date complète
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
  // Sélectionner tous les utilisateurs
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };
  
  // Sélectionner un utilisateur individuel
  const handleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };
  
  // Suspendre un utilisateur
  const handleSuspendUser = (id: string) => {
    setUsers(users.map(user => 
      user.id === id
        ? { 
            ...user, 
            status: { 
              active: false, 
              suspended: true, 
              banned: false 
            } 
          }
        : user
    ));
    
    toast({
      title: 'Utilisateur suspendu',
      description: 'L\'utilisateur a été suspendu temporairement.',
    });
  };
  
  // Réactiver un utilisateur
  const handleActivateUser = (id: string) => {
    setUsers(users.map(user => 
      user.id === id
        ? { 
            ...user, 
            status: { 
              active: true, 
              suspended: false, 
              banned: false 
            } 
          }
        : user
    ));
    
    toast({
      title: 'Utilisateur réactivé',
      description: 'L\'utilisateur a été réactivé avec succès.',
    });
  };
  
  // Bannir un utilisateur
  const handleBanUser = (id: string) => {
    setUsers(users.map(user => 
      user.id === id
        ? { 
            ...user, 
            status: { 
              active: false, 
              suspended: false, 
              banned: true 
            } 
          }
        : user
    ));
    
    toast({
      title: 'Utilisateur banni',
      description: 'L\'utilisateur a été banni de la plateforme.',
      variant: 'destructive'
    });
  };
  
  // Promouvoir un utilisateur au rôle de modérateur
  const handlePromoteToModerator = (id: string) => {
    setUsers(users.map(user => 
      user.id === id
        ? { ...user, role: 'moderator' as const }
        : user
    ));
    
    toast({
      title: 'Utilisateur promu',
      description: 'L\'utilisateur a été promu au rôle de modérateur.',
    });
  };
  
  // Rétrograder un modérateur au rôle d'utilisateur
  const handleDemoteToUser = (id: string) => {
    setUsers(users.map(user => 
      user.id === id
        ? { ...user, role: 'user' as const }
        : user
    ));
    
    toast({
      title: 'Utilisateur rétrogradé',
      description: 'Le modérateur a été rétrogradé au rôle d\'utilisateur.',
    });
  };
  
  // Supprimer un utilisateur
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    
    toast({
      title: 'Utilisateur supprimé',
      description: 'L\'utilisateur a été supprimé de la plateforme.',
      variant: 'destructive'
    });
  };
  
  // Actions groupées
  const handleBulkAction = (action: 'suspend' | 'activate' | 'ban' | 'delete') => {
    if (selectedUsers.length === 0) return;
    
    switch (action) {
      case 'suspend':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id)
            ? { 
                ...user, 
                status: { 
                  active: false, 
                  suspended: true, 
                  banned: false 
                } 
              }
            : user
        ));
        
        toast({
          title: 'Utilisateurs réactivés',
          description: `${selectedUsers.length} utilisateurs ont été réactivés.`,
        });
        break;
      
      case 'ban':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id)
            ? { 
                ...user, 
                status: { 
                  active: false, 
                  suspended: false, 
                  banned: true 
                } 
              }
            : user
        ));
        
        toast({
          title: 'Utilisateurs bannis',
          description: `${selectedUsers.length} utilisateurs ont été bannis.`,
          variant: 'destructive'
        });
        break;
      
      case 'delete':
        setUsers(users.filter(user => !selectedUsers.includes(user.id)));
        
        toast({
          title: 'Utilisateurs supprimés',
          description: `${selectedUsers.length} utilisateurs ont été supprimés.`,
          variant: 'destructive'
        });
        break;
    }
    
    setSelectedUsers([]);
  };
  
  // Créer un nouvel utilisateur
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.username || !newUser.email) {
      toast({
        title: 'Champs manquants',
        description: 'Veuillez remplir tous les champs obligatoires.',
        variant: 'destructive'
      });
      return;
    }
    
    const newId = (users.length + 1).toString();
    
    setUsers([
      ...users,
      {
        id: newId,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role as 'user' | 'moderator' | 'admin',
        createdAt: new Date().toISOString(),
        status: {
          active: true,
          suspended: false,
          banned: false
        },
        reportedIncidents: [],
        savedIncidents: []
      }
    ]);
    
    setNewUser({
      username: '',
      email: '',
      role: 'user',
    });
    
    setShowNewUserDialog(false);
    
    toast({
      title: 'Utilisateur créé',
      description: `L'utilisateur ${newUser.username} a été créé avec succès.`,
    });
  };
  
  // Obtenir le badge de statut
  const getStatusBadge = (status: StatusIndicator) => {
    if (status.banned) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Banni</Badge>;
    } else if (status.suspended) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Suspendu</Badge>;
    } else if (status.active) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Actif</Badge>;
    }
    return <Badge variant="outline">Inconnu</Badge>;
  };
  
  // Obtenir le badge de rôle
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Admin</Badge>;
      case 'moderator':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Modérateur</Badge>;
      case 'user':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Utilisateur</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-gray-500">Gérez les comptes utilisateurs de la plateforme Vigilance</p>
        </div>
        
        <Dialog open={showNewUserDialog} onOpenChange={setShowNewUserDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau compte utilisateur.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateUser}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="jean.dupont"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="jean.dupont@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="moderator">Modérateur</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowNewUserDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer l'utilisateur</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Liste des utilisateurs</CardTitle>
              <CardDescription>
                {filteredUsers.length} utilisateurs sur {users.length} au total
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedUsers.length > 0 && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('activate')}
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Activer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('suspend')}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Suspendre
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => handleBulkAction('ban')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Bannir
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
                placeholder="Rechercher par nom, email ou ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-1 flex-wrap gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="user">Utilisateurs</SelectItem>
                  <SelectItem value="moderator">Modérateurs</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="suspended">Suspendus</SelectItem>
                  <SelectItem value="banned">Bannis</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="ml-auto" onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}>
                Réinitialiser
              </Button>
            </div>
          </div>
          
          {/* Users Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={
                        filteredUsers.length > 0 && 
                        selectedUsers.length === filteredUsers.length
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Sélectionner tous les utilisateurs"
                    />
                  </TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Date d'inscription</TableHead>
                  <TableHead className="hidden sm:table-cell">Rôle</TableHead>
                  <TableHead className="hidden sm:table-cell">Statut</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users className="h-8 w-8 mb-2" />
                        <p>Aucun utilisateur trouvé</p>
                        <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleSelectUser(user.id)}
                          aria-label={`Sélectionner l'utilisateur ${user.firstName}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.profileImage} alt={user.firstName} />
                            <AvatarFallback>{getInitials(user.firstName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.firstName}</p>
                            <p className="text-xs text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3.5 w-3.5 mr-1 text-gray-500 flex-shrink-0" />
                          <span className="truncate max-w-xs">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500 flex-shrink-0" />
                          <span title={formatDate(user.createdAt)}>
                            {formatRelativeDate(user.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getStatusBadge(user.status)}
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
                              <UserCog className="h-4 w-4 mr-2" />
                              Éditer le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Map className="h-4 w-4 mr-2" />
                              Voir les incidents
                            </DropdownMenuItem>
                            
                            {user.status.active ? (
                              <DropdownMenuItem 
                                onClick={() => handleSuspendUser(user.id)}
                              >
                                <Lock className="h-4 w-4 mr-2" />
                                Suspendre
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => handleActivateUser(user.id)}
                              >
                                <Unlock className="h-4 w-4 mr-2" />
                                Réactiver
                              </DropdownMenuItem>
                            )}
                            
                            {user.role === 'user' ? (
                              <DropdownMenuItem 
                                onClick={() => handlePromoteToModerator(user.id)}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Promouvoir modérateur
                              </DropdownMenuItem>
                            ) : user.role === 'moderator' ? (
                              <DropdownMenuItem 
                                onClick={() => handleDemoteToUser(user.id)}
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Rétrograder utilisateur
                              </DropdownMenuItem>
                            ) : null}
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleBanUser(user.id)}
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Bannir
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
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
              Affichage de <strong>1-{filteredUsers.length}</strong> sur <strong>{users.length}</strong> utilisateurs
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