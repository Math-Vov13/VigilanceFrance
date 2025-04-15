import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Comment } from '../../types';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ThumbsUp, Flag, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';

interface CommentSectionProps {
  comments: Comment[];
  incidentId: string;
  onAddComment: (incidentId: string, comment: Omit<Comment, 'id' | 'date'>) => void;
  onLikeComment?: (incidentId: string, commentId: string) => void;
  onReportComment?: (incidentId: string, commentId: string) => void;
}

export function CommentSection({ 
  comments, 
  incidentId, 
  onAddComment,
  onLikeComment,
  onReportComment
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newComment.trim() && username.trim()) {
      onAddComment(incidentId, {
        user: username,
        text: newComment,
        likes: 0,
        reported: false
      });
      
      setNewComment('');
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Format date to relative time (e.g., "il y a 2 heures")
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: fr 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Commentaires ({comments.length})
      </h3>
      
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-blue-100 text-blue-800">
                  <AvatarFallback>{getInitials(comment.user)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{comment.user}</p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(comment.date)}</p>
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
                  
                  <div className="flex items-center mt-2 gap-4">
                    <button 
                      className="flex items-center text-xs text-gray-500 hover:text-blue-600"
                      onClick={() => onLikeComment && onLikeComment(incidentId, comment.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {comment.likes || 0}
                    </button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center text-xs text-gray-500 hover:text-red-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer"
                          onClick={() => onReportComment && onReportComment(incidentId, comment.id)}
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          Signaler
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Aucun commentaire pour le moment. Soyez le premier à commenter.
        </p>
      )}
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Votre nom</label>
          <input
            type="text"
            className="px-3 py-2 border border-gray-300 rounded-md w-full text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Votre nom ou pseudo"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Votre commentaire</label>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Partagez vos informations ou observations..."
            className="min-h-24 resize-y"
            required
          />
        </div>
        
        <Button type="submit" className="w-full md:w-auto">
          Publier le commentaire
        </Button>
      </form>
    </div>
  );
}