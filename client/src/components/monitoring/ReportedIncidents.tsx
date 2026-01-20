import { useState } from 'react';
import { Incident } from '../../types';
import { 
  Trash2, 
  Edit2, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  MapPin,
  Eye,
  MessageSquare,
  ArrowUp
} from 'lucide-react';
import { incidentsAPI } from '../../../api/incidents';

interface ReportedIncidentsProps {
  incidents: Incident[];
  onRefresh: () => void;
  onDelete: (incidentId: string) => Promise<void>;
}

export function ReportedIncidents({ incidents, onRefresh, onDelete }: ReportedIncidentsProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      active: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        icon: <Clock className="w-4 h-4" />
      },
      verified: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        icon: <CheckCircle className="w-4 h-4" />
      },
      resolved: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        icon: <CheckCircle className="w-4 h-4" />
      },
      unverified: {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        icon: <AlertCircle className="w-4 h-4" />
      }
    };

    const badge = badges[status] || badges.unverified;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'border-green-500/50 bg-green-500/10',
      medium: 'border-yellow-500/50 bg-yellow-500/10',
      high: 'border-red-500/50 bg-red-500/10'
    };
    return colors[severity] || colors.medium;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) return;

    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'incident');
    } finally {
      setDeletingId(null);
    }
  };

  if (incidents.length === 0) {
    return (
      <div className="glass-card-dark rounded-xl p-12 border border-gray-800 text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Aucun incident signalé</h3>
        <p className="text-gray-400">
          Vous n'avez pas encore signalé d'incident. Allez sur la carte pour en ajouter un.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="glass-card-dark border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-xl"
        >
          {/* Card Header */}
          <div className={`border-l-4 p-6 ${getSeverityColor(incident.severity)}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{incident.title}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(incident.status || 'active')}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-300">
                    {incident.type}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setExpandedId(expandedId === incident.id ? null : incident.id)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                  title="Voir les détails"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(incident.id)}
                  disabled={deletingId === incident.id}
                  className="p-2 hover:bg-red-900/20 rounded-lg transition-colors text-red-400 hover:text-red-300 disabled:opacity-50"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
              <div>
                <p className="text-xs text-gray-400 mb-1">Localisation</p>
                <p className="text-sm text-gray-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  {incident.location.substring(0, 30)}...
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Votes</p>
                <p className="text-sm text-gray-300 flex items-center gap-1">
                  <ArrowUp className="w-3 h-3 text-purple-400" />
                  {incident.upvotes || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Commentaires</p>
                <p className="text-sm text-gray-300 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-blue-400" />
                  {incident.comments?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Coordonnées</p>
                <p className="text-xs text-gray-400">
                  {incident.coordinates.lat.toFixed(4)}, {incident.coordinates.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedId === incident.id && (
            <div className="border-t border-gray-800 p-6 bg-gray-800/50">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Description</h4>
                  <p className="text-gray-400 leading-relaxed">
                    {incident.description}
                  </p>
                </div>

                {incident.imageUrls && incident.imageUrls.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {incident.imageUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Incident photo ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                    Voir sur la carte
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}