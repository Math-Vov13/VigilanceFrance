import { useMemo } from 'react';
import { Incident } from '../../types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
} from 'lucide-react';

interface IncidentAnalyticsProps {
  incidents: Incident[];
}

export function IncidentAnalytics({ incidents }: IncidentAnalyticsProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    const totalIncidents = incidents.length;
    const resolvedIncidents = incidents.filter(i => i.status === 'resolved').length;
    const activeIncidents = incidents.filter(i => i.status === 'active').length;
    const verifiedIncidents = incidents.filter(i => i.status === 'verified').length;
    const totalVotes = incidents.reduce((sum, i) => sum + (i.upvotes || 0), 0);
    const totalComments = incidents.reduce((sum, i) => sum + (i.comments?.length || 0), 0);
    const averageVotes = totalIncidents > 0 ? (totalVotes / totalIncidents).toFixed(1) : '0';

    return {
      totalIncidents,
      resolvedIncidents,
      activeIncidents,
      verifiedIncidents,
      totalVotes,
      totalComments,
      averageVotes,
      resolutionRate: totalIncidents > 0 ? ((resolvedIncidents / totalIncidents) * 100).toFixed(1) : '0'
    };
  }, [incidents]);

  // Data for incident type distribution
  const typeDistribution = useMemo(() => {
    const types: Record<string, number> = {};
    incidents.forEach(incident => {
      types[incident.type] = (types[incident.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [incidents]);

  // Data for status distribution
  const statusDistribution = useMemo(() => {
    const statuses: Record<string, number> = {};
    incidents.forEach(incident => {
      const status = incident.status || 'unknown';
      statuses[status] = (statuses[status] || 0) + 1;
    });
    return Object.entries(statuses).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [incidents]);

  // Data for severity distribution
  const severityDistribution = useMemo(() => {
    const severities: Record<string, number> = {};
    incidents.forEach(incident => {
      severities[incident.severity] = (severities[incident.severity] || 0) + 1;
    });
    return Object.entries(severities).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [incidents]);

  // Data for trend over time (simulated)
  const trendData = useMemo(() => {
    const data: { week: string; incidents: number; resolved: number; active: number }[] = [];
    
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      const weekLabel = `Sem ${date.getWeek()}`;
      
      data.push({
        week: weekLabel,
        incidents: Math.floor(Math.random() * incidents.length) + 1,
        resolved: Math.floor(Math.random() * (incidents.length / 2)),
        active: Math.floor(Math.random() * (incidents.length / 3))
      });
    }
    return data;
  }, [incidents]);

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
  const STATUS_COLORS: Record<string, string> = {
    Active: '#FBBF24',
    Verified: '#60A5FA',
    Resolved: '#34D399',
    Unverified: '#9CA3AF'
  };

  if (incidents.length === 0) {
    return (
      <div className="glass-card-dark rounded-xl p-12 border border-gray-800 text-center">
        <Activity className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Aucune donnée</h3>
        <p className="text-gray-400">
          Aucun incident pour afficher les statistiques
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card-dark border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total signalés</p>
              <p className="text-3xl font-bold text-white">{stats.totalIncidents}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="glass-card-dark border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Résolus</p>
              <p className="text-3xl font-bold text-green-400">{stats.resolvedIncidents}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.resolutionRate}% de résolution</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </div>

        <div className="glass-card-dark border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">En cours</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.activeIncidents}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400 opacity-50" />
          </div>
        </div>

        <div className="glass-card-dark border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total votes</p>
              <p className="text-3xl font-bold text-purple-400">{stats.totalVotes}</p>
              <p className="text-xs text-gray-500 mt-1">Moy: {stats.averageVotes}/incident</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="glass-card-dark border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Évolution sur 5 semaines</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="incidents" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Signalés"
                dot={{ fill: '#3B82F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Résolus"
                dot={{ fill: '#10B981' }}
              />
              <Line 
                type="monotone" 
                dataKey="active" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Actifs"
                dot={{ fill: '#F59E0B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="glass-card-dark border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Distribution par statut</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Type Distribution */}
        <div className="glass-card-dark border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Types d'incidents</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Nombre" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="glass-card-dark border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Gravité des incidents</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Bar 
                dataKey="value" 
                fill="#EC4899" 
                radius={[8, 8, 0, 0]}
                name="Nombre"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card-dark border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Commentaires totaux</p>
          <p className="text-3xl font-bold text-blue-400">{stats.totalComments}</p>
          <p className="text-xs text-gray-500 mt-2">
            Participation moyenne: {(stats.totalComments / Math.max(stats.totalIncidents, 1)).toFixed(1)}
          </p>
        </div>

        <div className="glass-card-dark border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Incidents vérifiés</p>
          <p className="text-3xl font-bold text-blue-400">{stats.verifiedIncidents}</p>
          <p className="text-xs text-gray-500 mt-2">
            Taux de vérification: {((stats.verifiedIncidents / Math.max(stats.totalIncidents, 1)) * 100).toFixed(1)}%
          </p>
        </div>

        <div className="glass-card-dark border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Moyenne votes/incident</p>
          <p className="text-3xl font-bold text-purple-400">{stats.averageVotes}</p>
          <p className="text-xs text-gray-500 mt-2">
            Engagement communautaire
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to get week number
Date.prototype.getWeek = function() {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  yearStart.setHours(0, 0, 0, 0);
  const weekNum = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNum;
};