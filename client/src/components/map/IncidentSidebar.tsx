import { useState } from 'react';
import { Incident, Comment } from '../../types';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { X, MapPin, AlertTriangle, Droplets, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/use-toast';

type IncidentSidebarProps = {
  incident: Incident;
  onClose: () => void;
};

export function IncidentSidebar({ incident, onClose }: IncidentSidebarProps) {
  const [newComment, setNewComment] = useState('');
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleCommentSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour commenter",
        variant: "destructive",
      });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "Commentaire vide",
        description: "Veuillez écrire un commentaire",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would add the comment via API
    // For now we'll just show a success message
    toast({
      title: "Commentaire ajouté",
      description: "Votre commentaire a été ajouté avec succès",
    });
    
    setNewComment('');
  };
  
  const getIncidentIcon = () => {
    switch(incident.type) {
      case 'accident':
        return <AlertCircle className="w-6 h-6" />;
      case 'inondation':
        return <Droplets className="w-6 h-6" />;
      case 'vol':
      case 'agression':
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <MapPin className="w-6 h-6" />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'mineur': return 'bg-yellow-500';
      case 'moyen': return 'bg-orange-500';
      case 'majeur': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getIncidentTypeClass = (type: string) => {
    switch(type) {
      case 'accident': return 'bg-red-100 text-red-600';
      case 'inondation': return 'bg-blue-100 text-blue-600';
      case 'vol': return 'bg-yellow-100 text-yellow-600';
      case 'agression': return 'bg-orange-100 text-orange-600';
      case 'incendie': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <div className="w-full md:w-96 bg-white shadow-lg h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{incident.title}</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className={`mr-3 p-2 rounded-md ${getIncidentTypeClass(incident.type)}`}>
            {getIncidentIcon()}
          </div>
          <div>
            <div className="text-gray-600 text-sm capitalize">{incident.type}</div>
            <div className="text-gray-800 font-medium">{incident.location}</div>
          </div>
        </div>
        
        <div className="mb-4 bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-600 mb-1">Date et heure</div>
          <div className="text-gray-800">{formatDate(incident.date)}</div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">Gravité</div>
          <div className="flex items-center">
            <span className={`inline-block h-3 w-3 rounded-full mr-2 ${getSeverityColor(incident.severity)}`}></span>
            <span className="text-gray-800 capitalize">{incident.severity}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">Description</div>
          <div className="text-gray-800">{incident.description}</div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">Signalé par</div>
          <div className="text-gray-800">{incident.reportedBy}</div>
        </div>
        
        {incident.images && incident.images.length > 0 && (
          <div className="mb-4">
            <img 
              src={incident.images[0]} 
              alt="Image de l'incident" 
              className="w-full h-40 object-cover rounded-md"
            />
          </div>
        )}
        
        {/* Comments Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Commentaires ({incident.comments.length})</h3>
          
          {incident.comments.map((comment: Comment) => (
            <div key={comment.id} className="mb-4 bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{comment.user}</div>
                <div className="text-xs text-gray-500">{formatDate(comment.date)}</div>
              </div>
              <div className="text-gray-700">{comment.text}</div>
            </div>
          ))}
          
          {incident.comments.length === 0 && (
            <div className="text-gray-500 text-center py-4">
              Aucun commentaire pour le moment
            </div>
          )}
          
          {/* Add Comment Form */}
          <div className="mt-4">
            <Textarea 
              placeholder="Ajouter un commentaire..." 
              className="w-full p-3 border border-gray-300"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button 
              className="mt-2"
              onClick={handleCommentSubmit}
            >
              Commenter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}