import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Flag, 
  CheckCircle,
  Trash2,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import commentService, { 
  Comment, 
  CommentStatus, 
  CommentFilters 
} from '@/services/admin/commentService';
import { useNavigate } from 'react-router-dom';

export default function AdminComments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for comments list
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // State for comment detail
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  
  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // State for loading and error
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters
  const [filters, setFilters] = useState<CommentFilters>({
    status: undefined,
    search: '',
    page: 1,
    limit: 10
  });

  // Function to fetch comments with filters
  const fetchComments = useCallback(async (commentFilters: CommentFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await commentService.getComments(commentFilters);
      setComments(response.data);
      setTotalComments(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Une erreur est survenue lors du chargement des commentaires.');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les commentaires. Veuillez réessayer."
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  // Fetch comments on component mount and when filters change
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Handle filter changes
  const handleFilterChange = (key: keyof CommentFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 }; // Reset to page 1 when filters change
    setFilters(newFilters);
    fetchComments(newFilters);
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(newFilters);
    fetchComments(newFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchComments(newFilters);
  };

  // View incident associated with comment
  const handleViewIncident = (incidentId: number) => {
    navigate(`/admin/incidents?id=${incidentId}`);
  };

  // Handle comment approval
  const handleApproveComment = async (id: number) => {
    try {
      await commentService.approveComment(id);
      
      // Update the comment in the list
      setComments(prev => 
        prev.map(comment => 
          comment.id === id 
            ? { ...comment, status: 'approved' } 
            : comment
        )
      );
      
      toast({
        title: "Commentaire approuvé",
        description: `Le commentaire #${id} a été approuvé avec succès.`
      });
    } catch (err) {
      console.error(`Error approving comment ${id}:`, err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible d'approuver le commentaire #${id}.`
      });
    }
  };

  // Handle comment flagging
  const handleFlagComment = async (id: number) => {
    try {
      await commentService.flagComment(id);
      
      // Update the comment in the list
      setComments(prev => 
        prev.map(comment => 
          comment.id === id 
            ? { ...comment, status: 'flagged' } 
            : comment
        )
      );
      
      toast({
        title: "Commentaire signalé",
        description: `Le commentaire #${id} a été signalé pour examen.`,
        variant: "destructive"
      });
    } catch (err) {
      console.error(`Error flagging comment ${id}:`, err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de signaler le commentaire #${id}.`
      });
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (comment: Comment) => {
    setSelectedComment(comment);
    setDeleteDialogOpen(true);
  };

  // Handle comment deletion
  const handleDeleteComment = async () => {
    if (!selectedComment) return;
    
    setIsDeleting(true);
    
    try {
      await commentService.deleteComment(selectedComment.id);
      
      // Remove the comment from the list
      setComments(prev => prev.filter(comment => comment.id !== selectedComment.id));
      
      toast({
        title: "Commentaire supprimé",
        description: `Le commentaire #${selectedComment.id} a été supprimé avec succès.`,
        variant: "destructive"
      });
      
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error(`Error deleting comment ${selectedComment.id}:`, err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de supprimer le commentaire #${selectedComment.id}.`
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: CommentStatus }) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">En attente</Badge>;
      case 'flagged':
        return <Badge className="bg-red-500 hover:bg-red-600"><AlertTriangle className="w-3 h-3 mr-1" /> Signalé</Badge>;
      case 'deleted':
        return <Badge className="bg-slate-500 hover:bg-slate-600">Supprimé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Render table skeleton during loading
  const renderTableSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-10 bg-slate-700/50 rounded mb-2"></div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="h-16 bg-slate-700/30 rounded mb-2"></div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Modération des commentaires</h1>
        <p className="text-slate-400">Gérez et modérez les commentaires des utilisateurs sur tous les incidents.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher un commentaire..." 
            className="pl-9 bg-slate-800 border-slate-700 text-white"
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        <Select 
          value={filters.status || 'all'} 
          onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value as CommentStatus)}
        >
          <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvé</SelectItem>
            <SelectItem value="flagged">Signalé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Comments Table */}
      <div className="border rounded-md border-slate-700 bg-slate-800/50">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-slate-800">
              <TableRow className="border-slate-700 hover:bg-slate-700">
                <TableHead className="text-slate-300 font-medium">Commentaire</TableHead>
                <TableHead className="text-slate-300 font-medium">Incident</TableHead>
                <TableHead className="text-slate-300 font-medium">Utilisateur</TableHead>
                <TableHead className="text-slate-300 font-medium">Date</TableHead>
                <TableHead className="text-slate-300 font-medium">Statut</TableHead>
                <TableHead className="text-slate-300 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10">
                    {renderTableSkeleton()}
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="h-8 w-8 mb-2 text-red-500" />
                      <p>{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchComments()} 
                        className="mt-4 text-white border-slate-600"
                      >
                        Réessayer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : comments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    Aucun commentaire ne correspond aux critères de recherche
                  </TableCell>
                </TableRow>
              ) : (
                comments.map((comment) => (
                  <TableRow key={comment.id} className="border-slate-700 hover:bg-slate-700/50">
                    <TableCell className="font-medium text-white">
                      <div className="max-w-md truncate">{comment.text}</div>
                      {comment.reports > 0 && (
                        <Badge variant="outline" className="mt-1 bg-red-900/20 text-red-400 border-red-800/20">
                          <Flag className="w-3 h-3 mr-1" /> Signalé {comment.reports} fois
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-600 capitalize">{comment.incident.type}</Badge>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-slate-300 hover:text-white"
                          onClick={() => handleViewIncident(comment.incident.id)}
                        >
                          {comment.incident.title}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                          {comment.user.name.charAt(0)}
                        </div>
                        <span>{comment.user.name}</span>
                        {comment.user.status === 'warned' && (
                          <Badge className="bg-yellow-600">Averti</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{formatDate(comment.date)}</TableCell>
                    <TableCell><StatusBadge status={comment.status} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Actions</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem 
                            className="text-blue-400 hover:text-blue-400 focus:text-blue-400 cursor-pointer"
                            onClick={() => handleViewIncident(comment.incident.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Voir l'incident
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-green-500 hover:text-green-500 focus:text-green-500 cursor-pointer"
                            onClick={() => handleApproveComment(comment.id)}
                            disabled={comment.status === 'approved'}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approuver
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-500 hover:text-red-500 focus:text-red-500 cursor-pointer"
                            onClick={() => handleFlagComment(comment.id)}
                            disabled={comment.status === 'flagged'}
                          >
                            <Flag className="mr-2 h-4 w-4" />
                            Signaler
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem 
                            className="text-red-500 hover:text-red-500 focus:text-red-500 cursor-pointer"
                            onClick={() => handleOpenDeleteDialog(comment)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
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
        
        {/* Pagination */}
        {!loading && !error && comments.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
            <div className="text-sm text-slate-400">
              Affichage de <span className="font-medium text-white">{comments.length}</span>{' '}
              sur <span className="font-medium text-white">{totalComments}</span> commentaires
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-slate-700 text-slate-300"
              >
                Précédent
              </Button>
              <div className="flex items-center text-sm text-slate-300 space-x-1">
                <span>Page</span>
                <span className="font-medium text-white">{currentPage}</span>
                <span>sur</span>
                <span className="font-medium text-white">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-slate-700 text-slate-300"
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onOpenChange={(open) => {
          if (!isDeleting) setDeleteDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>
              {isDeleting ? "Suppression en cours" : "Confirmer la suppression"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {isDeleting ? (
                "Le commentaire est en cours de suppression..."
              ) : (
                selectedComment && `Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.`
              )}
            </DialogDescription>
          </DialogHeader>
          
          {isDeleting ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <>
              {selectedComment && (
                <div className="py-4 px-3 bg-slate-700 rounded-md text-sm text-slate-300">
                  <p className="mb-2">"{selectedComment.text}"</p>
                  <div className="text-xs text-slate-400 flex justify-between">
                    <span>Par {selectedComment.user.name}</span>
                    <span>{formatDate(selectedComment.date)}</span>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  disabled={isDeleting}
                >
                  Annuler
                </Button>
                <Button 
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteComment}
                  disabled={isDeleting}
                >
                  Supprimer définitivement
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}