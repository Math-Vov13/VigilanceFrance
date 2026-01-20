import { useState } from 'react';
import { Incident, Comment } from '../../types';
import { 
  MessageSquare, 
  ThumbsUp, 
  Flag, 
  Trash2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface UserCommentsProps {
  incidents: Incident[];
  onLikeComment: (incidentId: string, commentId: string) => Promise<void>;
  onReportComment: (incidentId: string, commentId: string) => Promise<void>;
}

export function UserComments({ incidents, onLikeComment, onReportComment }: UserCommentsProps) {
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [reportedComments, setReportedComments] = useState<Set<string>>(new Set());
  const [loadingCommentId, setLoadingCommentId] = useState<string | null>(null);

  // Extract all comments from incidents
  const allComments = incidents.flatMap(incident =>
    (incident.comments || []).map(comment => ({
      id: comment.id || '',
      incidentId: incident.id,
      incidentTitle: incident.title,
      author: comment.user || 'Anonyme',
      content: comment.text || '',
      timestamp: comment.date || new Date().toISOString(),
      likes: comment.likes || 0
    }))
  );

  const handleLikeComment = async (incidentId: string, commentId: string) => {
    setLoadingCommentId(commentId);
    try {
      await onLikeComment(incidentId, commentId);
      setLikedComments(prev => {
        const newSet = new Set(prev);
        if (newSet.has(commentId)) {
          newSet.delete(commentId);
        } else {
          newSet.add(commentId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Erreur lors du like du commentaire:', error);
    } finally {
      setLoadingCommentId(null);
    }
  };

  const handleReportComment = async (incidentId: string, commentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir signaler ce commentaire ?')) return;

    setLoadingCommentId(commentId);
    try {
      await onReportComment(incidentId, commentId);
      setReportedComments(prev => new Set(prev).add(commentId));
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
    } finally {
      setLoadingCommentId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (allComments.length === 0) {
    return (
      <div className="glass-card-dark rounded-xl p-12 border border-gray-800 text-center">
        <MessageSquare className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Aucun commentaire</h3>
        <p className="text-gray-400">
          Vous n'avez pas encore commenté les incidents. Participez à la discussion !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allComments.map((comment) => (
        <div
          key={comment.id}
          className="glass-card-dark border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
        >
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {comment.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{comment.author}</p>
                  <p className="text-xs text-gray-400">{formatDate(comment.timestamp)}</p>
                </div>
              </div>
              
              {/* Incident Link */}
              <a
                href={`/incident/${comment.incidentId}`}
                className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 mb-2 group"
              >
                <span className="line-clamp-1">Sur : {comment.incidentTitle}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            {reportedComments.has(comment.id) && (
              <span className="px-2 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-400">
                Signalé
              </span>
            )}
          </div>

          {/* Comment Content */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700">
            <p className="text-gray-300 leading-relaxed">{comment.content}</p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLikeComment(comment.incidentId, comment.id)}
              disabled={loadingCommentId === comment.id}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all text-sm ${
                likedComments.has(comment.id)
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'bg-gray-800 text-gray-400 hover:text-blue-400 hover:bg-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ThumbsUp className={`w-4 h-4 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
              <span>{comment.likes}</span>
            </button>

            <button
              onClick={() => handleReportComment(comment.incidentId, comment.id)}
              disabled={loadingCommentId === comment.id || reportedComments.has(comment.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all text-sm bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Flag className="w-4 h-4" />
              <span>Signaler</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}