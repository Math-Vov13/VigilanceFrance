import { useState } from 'react';
import { Incident } from '../../types';
import { Button } from '../ui/button';
import { X, MapPin, ArrowUp, Share2, CheckCircle } from 'lucide-react';
import { CommentSection } from './CommentSection';
import { incidentTypes, severityLevels } from '../../constants/constants';

interface IncidentSidebarProps {
  incident: Incident;
  onClose: () => void;
  onLikeComment?: (incidentId: string, commentId: string) => void;
  onReportComment?: (incidentId: string, commentId: string) => void;
  onUpvote?: (incidentId: string) => void;
  onMarkAsSolved?: (incidentId: string) => void;
}

export function IncidentSidebar({ 
  incident, 
  onClose,
  onLikeComment,
  onReportComment,
  onUpvote,
  onMarkAsSolved
}: IncidentSidebarProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [hasMarkedSolved, setHasMarkedSolved] = useState(false);
  
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
  
  const handleUpvote = () => {
    if (onUpvote && !hasVoted) {
      onUpvote(incident.id);
      setHasVoted(true);
    }
  };
  
  const handleMarkAsSolved = () => {
    if (onMarkAsSolved && !hasMarkedSolved) {
      onMarkAsSolved(incident.id);
      setHasMarkedSolved(true);
    }
  };
  
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
  
  const isResolved = incident.status === 'resolved';
  
  return (
    <div className="flex flex-col h-full bg-gray-900 shadow-2xl border-l border-gray-800">
      {/* Header with gradient */}
      <div className="px-6 py-4 gradient-navbar border-b border-gray-800 flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-white truncate">{incident.title}</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Incident details */}
      <div className="flex-grow overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Type and severity badges */}
          <div className="flex flex-wrap gap-2">
            <span 
              className="px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg"
              style={{ 
                backgroundColor: `${incidentType.color}30`, 
                color: incidentType.color,
                border: `1px solid ${incidentType.color}50`
              }}
            >
              {incidentType.label}
            </span>
            
            <span 
              className="px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg"
              style={{ 
                backgroundColor: `${severityLevel.color}30`, 
                color: severityLevel.color,
                border: `1px solid ${severityLevel.color}50`
              }}
            >
              {severityLevel.label}
            </span>
            
            {incident.status && (
              <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg ${
                incident.status === 'resolved' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : incident.status === 'verified' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                    : 'bg-gray-700 text-gray-300 border border-gray-600'
              }`}>
                {incident.status === 'active' && 'En cours'}
                {incident.status === 'verified' && 'Vérifié'}
                {incident.status === 'resolved' && 'Résolu'}
                {incident.status === 'unverified' && 'Non vérifié'}
              </span>
            )}
          </div>
          
          {/* Main description */}
          <div className="glass-card-dark p-4 rounded-lg">
            <p className="text-gray-300 leading-relaxed">{incident.description}</p>
          </div>
          
          {/* Metadata */}
          <div className="space-y-3 text-sm glass-card-dark p-4 rounded-lg">
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2 text-blue-400" />
              <span>{incident.location}</span>
            </div>
          </div>
          
          {/* Images if available */}
          {incident.imageUrls && incident.imageUrls.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Photos</h3>
              <div className="grid grid-cols-2 gap-3">
                {incident.imageUrls.map((url, index) => (
                  <img 
                    key={index}
                    src={url}
                    alt={`Image de l'incident ${index + 1}`}
                    className="rounded-lg object-cover w-full h-32 border border-gray-800 hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Voting and actions */}
          <div className="flex items-center justify-between glass-card-dark p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <button 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  hasVoted 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                    : 'text-gray-400 hover:text-blue-400 hover:bg-gray-800'
                }`}
                onClick={handleUpvote}
                disabled={hasVoted || isResolved}
              >
                <ArrowUp className="h-5 w-5" />
                <span>{incident.upvotes || 0}</span>
              </button>
              
              {!isResolved && (
                <button 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                    hasMarkedSolved 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                      : 'text-gray-400 hover:text-green-400 hover:bg-gray-800'
                  }`}
                  onClick={handleMarkAsSolved}
                  disabled={hasMarkedSolved || isResolved}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Résolu</span>
                </button>
              )}
            </div>
            
            <div className="relative">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors border border-gray-700"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <Share2 className="h-4 w-4" />
                Partager
              </button>
              
              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-800 rounded-lg shadow-2xl z-20 border border-gray-700 overflow-hidden">
                  <ul className="py-1">
                    <li>
                      <button 
                        className="px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left transition-colors"
                        onClick={() => handleShare('copy')}
                      >
                        Copier le lien
                      </button>
                    </li>
                    <li>
                      <button 
                        className="px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left transition-colors"
                        onClick={() => handleShare('twitter')}
                      >
                        Twitter
                      </button>
                    </li>
                    <li>
                      <button 
                        className="px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left transition-colors"
                        onClick={() => handleShare('facebook')}
                      >
                        Facebook
                      </button>
                    </li>
                    <li>
                      <button 
                        className="px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left transition-colors"
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
          
          {/* Socket-based Comments section */}
          <div className="glass-card-dark rounded-lg overflow-hidden">
            <CommentSection 
              incidentId={incident.id}
              onLikeComment={onLikeComment}
              onReportComment={onReportComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}