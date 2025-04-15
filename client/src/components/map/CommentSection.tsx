// Updated CommentSection component with proper safety checks
import { useState } from 'react';
import { Comment } from '../../types';
import { Button } from '../ui/button';
import { ThumbsUp, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CommentSectionProps {
  incidentId: string;
  comments?: Comment[];
  onAddComment: (incidentId: string, comment: Omit<Comment, 'id' | 'date'>) => void;
  onLikeComment?: (incidentId: string, commentId: string) => void;
  onReportComment?: (incidentId: string, commentId: string) => void;
}

export function CommentSection({
  incidentId,
  comments = [], // Provide a default empty array
  onAddComment,
  onLikeComment,
  onReportComment
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    setIsSubmitting(true);
    
    try {
      onAddComment(incidentId, {
        text: commentText.trim(),
        user: 'Utilisateur',
        likes: 0,
        reported: false
      });
      
      setCommentText('');
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting || !commentText.trim()}
          >
            {isSubmitting ? 'Envoi...' : 'Commenter'}
          </Button>
        </div>
      </form>
    </div>
  );
}