import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  MapPin,
  Users,
  MessageSquare,
  AlertTriangle,
  Activity,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Eye,
  Bell
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export function AdminDashboard() {
  const navigate = useNavigate();

  // Sample statistics data
  const stats = [
    { 
      title: 'Incidents Totaux', 
      value: 1248, 
      icon: <MapPin className="h-5 w-5" />, 
      change: 12.5, 
      positive: true,
      route: '/admin/incidents'
    },
    { 
      title: 'Utilisateurs Actifs', 
      value: 27845, 
      icon: <Users className="h-5 w-5" />, 
      change: 8.2, 
      positive: true,
      route: '/admin/users'
    },
    { 
      title: 'Commentaires', 
      value: 4328, 
      icon: <MessageSquare className="h-5 w-5" />, 
      change: 5.7, 
      positive: true,
      route: '/admin/comments'
    },
    { 
      title: 'Signalements', 
      value: 187, 
      icon: <AlertTriangle className="h-5 w-5" />, 
      change: 2.3, 
      positive: false,
      route: '/admin/moderation'
    },
  ];

  // Sample incident activity data for the line chart
  const activityData = [
    { date: 'Lun', incidents: 45, comments: 32 },
    { date: 'Mar', incidents: 38, comments: 28 },
    { date: 'Mer', incidents: 52, comments: 41 },
    { date: 'Jeu', incidents: 40, comments: 35 },
    { date: 'Ven', incidents: 55, comments: 48 },
    { date: 'Sam', incidents: 68, comments: 52 },
    { date: 'Dim', incidents: 42, comments: 30 },
  ];

  // Sample data for incident types distribution
  const incidentTypesData = [
    { name: 'Accidents', value: 35 },
    { name: 'Inondations', value: 15 },
    { name: 'Incendies', value: 10 },
    { name: 'Vols', value: 20 },
    { name: 'Agressions', value: 12 },
    { name: 'Autres', value: 8 },
  ];

  // Sample data for incident severity
  const severityData = [
    { name: 'Mineure', value: 120 },
    { name: 'Moyenne', value: 85 },
    { name: 'Majeure', value: 42 },
    { name: 'Critique', value: 23 },
  ];

  // Recent incidents
  const recentIncidents = [
    { 
      id: 1, 
      title: 'Accident de la route', 
      location: 'Paris, 75001', 
      time: 'Il y a 2 heures', 
      severity: 'moyen',
      verified: true
    },
    { 
      id: 2, 
      title: 'Inondation rue principale', 
      location: 'Lyon, 69002', 
      time: 'Il y a 5 heures', 
      severity: 'majeur',
      verified: true
    },
    { 
      id: 3, 
      title: 'Vol à l\'arraché', 
      location: 'Marseille, 13001', 
      time: 'Il y a 8 heures', 
      severity: 'mineur',
      verified: false
    },
    { 
      id: 4, 
      title: 'Agression dans le métro', 
      location: 'Paris, 75011', 
      time: 'Il y a 12 heures', 
      severity: 'moyen',
      verified: false
    },
  ];

  // Recent notifications
  const recentNotifications = [
    {
      id: 1,
      message: "Un incident a été signalé comme inapproprié",
      time: "Il y a 30 minutes",
      type: "warning"
    },
    {
      id: 2,
      message: "Nouveau commentaire sur l'incident 'Accident de la route'",
      time: "Il y a 45 minutes",
      type: "comment"
    },
    {
      id: 3,
      message: "5 nouveaux utilisateurs enregistrés aujourd'hui",
      time: "Il y a 1 heure",
      type: "user"
    },
    {
      id: 4,
      message: "Incident 'Inondation rue principale' vérifié par la mairie",
      time: "Il y a 3 heures",
      type: "verified"
    },
  ];

  // Colors for charts
  const COLORS = ['#2563EB', '#9333EA', '#F59E0B', '#EF4444', '#10B981', '#6B7280'];
  const SEVERITY_COLORS = {
    mineur: '#10B981',
    moyen: '#F59E0B',
    majeur: '#EF4444',
    critique: '#7F1D1D'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-gray-500">Aperçu des activités et statistiques de la plateforme Vigilance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(stat.route)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="bg-blue-100 p-2.5 rounded-full">
                  {stat.icon}
                </div>
                <div className={`flex items-center ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.positive ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">{stat.change}%</span>
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-3xl font-bold">{stat.value.toLocaleString()}</h2>
                <p className="text-gray-500 mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Activité hebdomadaire
            </CardTitle>
            <CardDescription>Nombre d'incidents et commentaires des 7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="incidents"
                    stroke="#2563EB"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="comments"
                    stroke="#8B5CF6"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Incident Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
              Types d'incidents
            </CardTitle>
            <CardDescription>Répartition des incidents par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incidentTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} incidents`, 'Quantité']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Second Row of Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Severity Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Distribution par gravité
            </CardTitle>
            <CardDescription>Nombre d'incidents par niveau de gravité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Incidents" radius={[4, 4, 0, 0]}>
                    {severityData.map((entry, index) => {
                      let color;
                      switch (entry.name) {
                        case 'Mineure': color = '#10B981'; break;
                        case 'Moyenne': color = '#F59E0B'; break;
                        case 'Majeure': color = '#EF4444'; break;
                        case 'Critique': color = '#7F1D1D'; break;
                        default: color = '#6B7280';
                      }
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Incidents List */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents récents</CardTitle>
            <CardDescription>Derniers incidents signalés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0">
                  <div className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0`} style={{ 
                    backgroundColor: incident.severity === 'mineur' 
                      ? SEVERITY_COLORS.mineur 
                      : incident.severity === 'moyen'
                        ? SEVERITY_COLORS.moyen
                        : incident.severity === 'majeur'
                          ? SEVERITY_COLORS.majeur
                          : SEVERITY_COLORS.critique
                  }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{incident.title}</p>
                      {incident.verified && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                          Vérifié
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">{incident.location}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{incident.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-600 text-sm font-medium hover:underline"
                onClick={() => navigate('/admin/incidents')}
              >
                Voir tous les incidents →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notifications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-600" />
              Notifications récentes
            </CardTitle>
            <CardDescription>Alertes et mises à jour de la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0">
                  <div className="p-2 rounded-full flex-shrink-0" style={{ 
                    backgroundColor: 
                      notification.type === 'warning' ? '#FEF3C7' : 
                      notification.type === 'comment' ? '#EFF6FF' :
                      notification.type === 'user' ? '#F3E8FF' : '#DCFCE7'
                  }}>
                    {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    {notification.type === 'comment' && <MessageSquare className="h-4 w-4 text-blue-500" />}
                    {notification.type === 'user' && <Users className="h-4 w-4 text-purple-500" />}
                    {notification.type === 'verified' && <Eye className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{notification.message}</p>
                    <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-600 text-sm font-medium hover:underline"
                onClick={() => navigate('/admin/notifications')}
              >
                Voir toutes les notifications →
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accès direct aux tâches courantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-3 text-left"
              onClick={() => navigate('/admin/moderation')}
            >
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Modérer les signalements</p>
                <p className="text-xs text-gray-500">8 signalements en attente</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-3 text-left"
              onClick={() => navigate('/admin/incidents?filter=unverified')}
            >
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <Eye className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">Vérifier des incidents</p>
                <p className="text-xs text-gray-500">15 incidents non vérifiés</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-3 text-left"
              onClick={() => navigate('/admin/users')}
            >
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Gérer les utilisateurs</p>
                <p className="text-xs text-gray-500">5 nouveaux aujourd'hui</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-3 text-left"
              onClick={() => navigate('/admin/stats')}
            >
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Analyser les statistiques</p>
                <p className="text-xs text-gray-500">Vue détaillée des performances</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}