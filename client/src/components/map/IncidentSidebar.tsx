import { useState } from 'react';
import { Comment, Incident } from '../../types';
import { Button } from '../ui/button';
import { X, MapPin, Clock, User, AlertTriangle, ArrowUp, ArrowDown, Share2 } from 'lucide-react';
import { CommentSection } from './CommentSection';
import { incidentTypes, severityLevels } from '../../constants/constants';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface IncidentSidebarProps {
  incident: Incident;
  onClose: () => void;
  onAddComment: (incidentId: number, comment: Omit<Comment, 'id' | 'date'>) => void;
  onLikeComment?: (incidentId: number, commentId: number) => void;
  onReportComment?: (incidentId: number, commentId: number) => void;
}

export function IncidentSidebar({ 
  incident, 
  onClose,
  onAddComment,
  onLikeComment,
  onReportComment
}: IncidentSidebarProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Get incident type info
  const incidentType = incidentTypes.find(t => t.value === incident.type) || {
    label: 'Autre',
    color: '#9E9E9E',
    icon: 'alert-circle'
  };
  
  // Get severity level info
  const severityLevel = severityLevels.find(s => s.value === incident.severity) || {
    label: 'Inconnu',
    color: '#9E9E9E'
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPpp', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  // Share incident
  const handleShare = async (platform: 'copy' | 'twitter' | 'facebook' | 'whatsapp') => {
    const url = `${window.location.origin}/incident/${incident.id}`;
    const title = `Incident signalé: ${incident.title}`;
    
    switch (platform) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          alert('Lien copié dans le presse-papier!');
        } catch (err) {
          console.error('Error copying link:', err);
          alert('Impossible de copier le lien. Veuillez réessayer.');
        }
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`);
        break;
    }
    
    setShowShareOptions(false);
  };
  
  return (
    <div className="flex flex-col h-full bg-white shadow-lg border-l border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="text-xl font-semibold truncate">{incident.title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Incident details */}
      <div className="flex-grow overflow-y-auto">
        <div className="p-6">
          {/* Type and severity badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${incidentType.color}20`, color: incidentType.color }}
            >
              {incidentType.label}
            </span>
            
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${severityLevel.color}20`, color: severityLevel.color }}
            >
              {severityLevel.label}
            </span>
            
            {incident.status && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {incident.status === 'active' && 'En cours'}
                {incident.status === 'verified' && 'Vérifié'}
                {incident.status === 'resolved' && 'Résolu'}
                {incident.status === 'unverified' && 'Non vérifié'}
              </span>
            )}
          </div>
          
          {/* Main description */}
          <p className="text-gray-700 mb-6">{incident.description}</p>
          
          {/* Metadata */}
          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{incident.location}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{formatDate(incident.date)}</span>
            </div>
            
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Signalé par {incident.reportedBy}</span>
            </div>
            
            {incident.verifiedBy && (
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>Vérifié par {incident.verifiedBy}</span>
              </div>
            )}
          </div>
          
          {/* Images if available */}
          {incident.imageUrls && incident.imageUrls.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Photos</h3>
              <div className="grid grid-cols-2 gap-2">
                {incident.imageUrls.map((url, index) => (
                  <img 
                    key={index}
                    src={url}
                    alt={`Image de l'incident ${index + 1}`}
                    className="rounded-lg object-cover w-full h-32"
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Voting and actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                <ArrowUp className="h-5 w-5" />
                <span>{incident.upvotes || 0}</span>
              </button>
              
              <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
                <ArrowDown className="h-5 w-5" />
                <span>{incident.downvotes || 0}</span>
              </button>
            </div>
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              
              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                  <ul className="py-1">
                    <li>
                      <button 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleShare('copy')}
                      >
                        Copier le lien
                      </button>
                    </li>
                    <li>
                      <button 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleShare('twitter')}
                      >
                        Twitter
                      </button>
                    </li>
                    <li>
                      <button 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleShare('facebook')}
                      >
                        Facebook
                      </button>
                    </li>
                    <li>
                      <button 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleShare('whatsapp')}
                      >
                        WhatsApp
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Comments section */}
          <CommentSection 
            comments={incident.comments}
            incidentId={incident.id}
            onAddComment={onAddComment}
            onLikeComment={onLikeComment}
            onReportComment={onReportComment}
          />
        </div>
      </div>
    </div>
  );
}