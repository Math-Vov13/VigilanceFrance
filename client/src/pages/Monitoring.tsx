import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Incident } from '@/types';
import { Loader2, AlertCircle } from 'lucide-react';
import { ReportedIncidents } from '@/components/monitoring/ReportedIncidents';
import { UserComments } from '@/components/monitoring/UserComments';
import { IncidentAnalytics } from '@/components/monitoring/IncidentAnalytics';
import { mapsApi } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export default function MonitoringPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'incidents' | 'comments' | 'analytics'>('incidents');

  // Fetch user's incidents on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserIncidents();
    }
  }, [isAuthenticated, user]);

  const fetchUserIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all incidents and filter by user
      const allIncidents = await mapsApi.getIncidents();
      
      // Filter incidents reported by current user
      // Adjust the filter based on your actual API response structure
      const userIncidents = allIncidents.filter(
        (incident: any) => 
          incident.userId === user?._id || 
          incident.reportedBy === user?._id ||
          incident.createdBy === user?._id
      );
      
      setIncidents(userIncidents);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
      setError('Erreur lors du chargement des incidents. Veuillez réessayer.');
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleDeleteIncident = useCallback(async (incidentId: string) => {
    try {
      await mapsApi.deleteIncident(incidentId);
      setIncidents(prev => prev.filter(i => i.id !== incidentId));
      
      toast({
        title: "Incident supprimé",
        description: "L'incident a été supprimé avec succès.",
        variant: "default"
      });
    } catch (err) {
      console.error('Failed to delete incident:', err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'incident.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleLikeComment = useCallback(async (incidentId: string, commentId: string) => {
    try {
      await mapsApi.likeComment(incidentId, commentId);
      // Update local state
      setIncidents(prev => 
        prev.map(incident => {
          if (incident.id === incidentId) {
            return {
              ...incident,
              comments: incident.comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    likes: (comment.likes || 0) + 1
                  };
                }
                return comment;
              })
            };
          }
          return incident;
        })
      );
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  }, []);

  const handleReportComment = useCallback(async (incidentId: string, commentId: string) => {
    try {
      await mapsApi.reportComment(incidentId, commentId);
      toast({
        title: "Commentaire signalé",
        description: "Le commentaire a été signalé avec succès.",
        variant: "default"
      });
    } catch (err) {
      console.error('Failed to report comment:', err);
      toast({
        title: "Erreur",
        description: "Impossible de signaler ce commentaire.",
        variant: "destructive"
      });
    }
  }, [toast]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <span className="ml-3 text-gray-300">Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-16">
          <div className="text-center">
            <p className="text-xl text-red-400 mb-4">Vous devez être connecté</p>
            <a href="/auth" className="text-blue-400 hover:text-blue-300 underline">
              Se connecter
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Tableau de bord</h1>
            <p className="text-gray-400">
              Suivez vos signalements d'incidents, commentaires et statistiques
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 glass-card-dark border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
            <button
              onClick={() => setActiveTab('incidents')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'incidents'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Mes incidents ({incidents.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'comments'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Mes commentaires
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Statistiques
            </button>
          </div>

          {/* Content Sections */}
          {activeTab === 'incidents' && (
            <ReportedIncidents 
              incidents={incidents} 
              onRefresh={fetchUserIncidents}
              onDelete={handleDeleteIncident}
            />
          )}
          {activeTab === 'comments' && (
            <UserComments 
              incidents={incidents}
              onLikeComment={handleLikeComment}
              onReportComment={handleReportComment}
            />
          )}
          {activeTab === 'analytics' && (
            <IncidentAnalytics incidents={incidents} />
          )}
        </div>
      </div>
    </div>
  );
}