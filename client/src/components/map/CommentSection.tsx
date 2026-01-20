import { useState } from 'react';
import { Button } from '../ui/button';
import { ThumbsUp, Flag, AlertCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSocketComments } from '../../hooks/useSocketComment';
import { Alert, AlertDescription } from '../ui/alert';

interface CommentSectionProps {
  incidentId: string;
  onLikeComment?: (incidentId: string, commentId: string) => void;
  onReportComment?: (incidentId: string, commentId: string) => void;
}

export function CommentSection({
  incidentId,
  onLikeComment,
  onReportComment
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const {
    comments,
    isConnected,
    error,
    loading,
    sendComment
  } = useSocketComments(incidentId);
  
  // Safely format the relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if it's a valid date
      if (isNaN(date.getTime())) {
        return 'il y a un moment';
      }
      return formatDistanceToNow(date, { locale: fr, addSuffix: true });
    } catch (error) {
      console.error('Error formatting relative time:', error);
      return 'il y a un moment';
    }
  };
  
  // Handle comment submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      sendComment(commentText.trim());
      setCommentText('');
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };
  
  // Handle like comment
  const handleLike = (commentId: string) => {
    if (onLikeComment) {
      onLikeComment(incidentId, commentId);
    }
  };
  
  // Handle report comment
  const handleReport = (commentId: string) => {
    if (onReportComment) {
      onReportComment(incidentId, commentId);
    }
  };
  
  // Ensure comments is an array (defensive programming)
  const safeComments = Array.isArray(comments) ? comments : [];
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Commentaires ({safeComments.length})</h3>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2">Chargement des commentaires...</span>
        </div>
      ) : (
        <>
          {/* Comment list */}
          {safeComments.length > 0 ? (
            <div className="space-y-4 mb-6">
              {safeComments.map(comment => (
                <div 
                  key={comment.id} 
                  className={`p-3 rounded-lg ${
                    comment.reported 
                      ? 'bg-gray-100 text-gray-500' 
                      : 'bg-gray-100'
                  }`}
                >
                  {comment.reported ? (
                    <p className="text-sm italic">Ce commentaire a été signalé et est en attente de modération.</p>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{comment.user || 'Utilisateur'}</p>
                          <p className="text-sm text-gray-500">
                            {comment.date ? formatRelativeTime(comment.date) : 'il y a un moment'}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-gray-500 hover:text-blue-600"
                            onClick={() => handleLike(comment.id)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          
                          <span className="text-sm">{comment.likes || 0}</span>
                          
                          <button 
                            className="text-gray-500 hover:text-red-600"
                            onClick={() => handleReport(comment.id)}
                          >
                            <Flag className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="mt-2">{comment.text}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">Aucun commentaire pour le moment.</p>
          )}
          
          {/* Add comment form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ajouter un commentaire..."
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              
              <Button 
                type="submit"
                disabled={!isConnected || !commentText.trim()}
              >
                {!isConnected ? 'Connexion...' : 'Commenter'}
              </Button>
              
              {!isConnected && !loading && (
                <p className="text-sm text-amber-600">Tentative de connexion au serveur de commentaires...</p>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}