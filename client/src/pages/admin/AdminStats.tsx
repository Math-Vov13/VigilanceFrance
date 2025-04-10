import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  ComposedChart,
} from 'recharts';
import { Download, Calendar, TrendingUp, MapPin, Layers, FileText } from 'lucide-react';

// Types pour les périodes
type TimePeriod = 'day' | 'week' | 'month' | 'year';

export function AdminStats() {
  // État pour contrôler la période affichée
  const [period, setPeriod] = useState<TimePeriod>('month');
  
  // Couleurs pour les graphiques
  const COLORS = ['#2563EB', '#9333EA', '#F59E0B', '#EF4444', '#10B981', '#6B7280'];
  
  // Données simulées pour les incidents par type (sur différentes périodes)
  const incidentsByTypeData = {
    day: [
      { name: 'Accidents', count: 5 },
      { name: 'Inondations', count: 2 },
      { name: 'Incendies', count: 1 },
      { name: 'Vols', count: 8 },
      { name: 'Agressions', count: 3 },
      { name: 'Autres', count: 4 },
    ],
    week: [
      { name: 'Accidents', count: 32 },
      { name: 'Inondations', count: 12 },
      { name: 'Incendies', count: 8 },
      { name: 'Vols', count: 45 },
      { name: 'Agressions', count: 18 },
      { name: 'Autres', count: 22 },
    ],
    month: [
      { name: 'Accidents', count: 125 },
      { name: 'Inondations', count: 56 },
      { name: 'Incendies', count: 38 },
      { name: 'Vols', count: 180 },
      { name: 'Agressions', count: 72 },
      { name: 'Autres', count: 95 },
    ],
    year: [
      { name: 'Accidents', count: 1450 },
      { name: 'Inondations', count: 620 },
      { name: 'Incendies', count: 480 },
      { name: 'Vols', count: 2150 },
      { name: 'Agressions', count: 860 },
      { name: 'Autres', count: 1120 },
    ],
  };
  
  // Données simulées pour l'activité par jour
  const activityByDayData = [
    { day: 'Lun', incidents: 45, comments: 32, users: 120 },
    { day: 'Mar', incidents: 38, comments: 28, users: 115 },
    { day: 'Mer', incidents: 52, comments: 41, users: 140 },
    { day: 'Jeu', incidents: 40, comments: 35, users: 125 },
    { day: 'Ven', incidents: 55, comments: 48, users: 150 },
    { day: 'Sam', incidents: 68, comments: 52, users: 180 },
    { day: 'Dim', incidents: 42, comments: 30, users: 130 },
  ];
  
  // Données simulées pour l'évolution des incidents sur un mois
  const monthlyTrendData = [
    { date: '01/04', incidents: 18, verified: 12 },
    { date: '02/04', incidents: 22, verified: 15 },
    { date: '03/04', incidents: 26, verified: 20 },
    { date: '04/04', incidents: 31, verified: 22 },
    { date: '05/04', incidents: 38, verified: 28 },
    { date: '06/04', incidents: 42, verified: 35 },
    { date: '07/04', incidents: 35, verified: 30 },
    { date: '08/04', incidents: 28, verified: 22 },
    { date: '09/04', incidents: 24, verified: 18 },
    { date: '10/04', incidents: 35, verified: 26 },
    { date: '11/04', incidents: 42, verified: 32 },
    { date: '12/04', incidents: 48, verified: 38 },
    { date: '13/04', incidents: 52, verified: 42 },
    { date: '14/04', incidents: 60, verified: 50 },
    { date: '15/04', incidents: 56, verified: 48 },
    { date: '16/04', incidents: 48, verified: 40 },
    { date: '17/04', incidents: 42, verified: 36 },
    { date: '18/04', incidents: 38, verified: 30 },
    { date: '19/04', incidents: 32, verified: 26 },
    { date: '20/04', incidents: 28, verified: 22 },
    { date: '21/04', incidents: 24, verified: 20 },
    { date: '22/04', incidents: 35, verified: 28 },
    { date: '23/04', incidents: 42, verified: 34 },
    { date: '24/04', incidents: 48, verified: 40 },
    { date: '25/04', incidents: 56, verified: 48 },
    { date: '26/04', incidents: 65, verified: 52 },
    { date: '27/04', incidents: 72, verified: 60 },
    { date: '28/04', incidents: 68, verified: 55 },
    { date: '29/04', incidents: 62, verified: 50 },
    { date: '30/04', incidents: 58, verified: 46 },
  ];
  
  // Données simulées pour la distribution géographique (par région)
  const regionData = [
    { name: 'Île-de-France', count: 350 },
    { name: 'Auvergne-Rhône-Alpes', count: 280 },
    { name: 'Nouvelle-Aquitaine', count: 220 },
    { name: 'Occitanie', count: 190 },
    { name: 'Hauts-de-France', count: 175 },
    { name: 'Grand Est', count: 165 },
    { name: 'Provence-Alpes-Côte d\'Azur', count: 155 },
    { name: 'Normandie', count: 120 },
    { name: 'Bretagne', count: 110 },
    { name: 'Pays de la Loire', count: 105 },
    { name: 'Bourgogne-Franche-Comté', count: 90 },
    { name: 'Centre-Val de Loire', count: 85 },
    { name: 'Corse', count: 35 },
  ];
  
  // Données simulées pour l'engagement des utilisateurs
  const userEngagementData = [
    { date: 'Semaine 1', nouveauxUtilisateurs: 120, utilisateursActifs: 85, incidents: 45 },
    { date: 'Semaine 2', nouveauxUtilisateurs: 150, utilisateursActifs: 110, incidents: 52 },
    { date: 'Semaine 3', nouveauxUtilisateurs: 180, utilisateursActifs: 140, incidents: 68 },
    { date: 'Semaine 4', nouveauxUtilisateurs: 210, utilisateursActifs: 165, incidents: 72 },
    { date: 'Semaine 5', nouveauxUtilisateurs: 250, utilisateursActifs: 200, incidents: 85 },
    { date: 'Semaine 6', nouveauxUtilisateurs: 220, utilisateursActifs: 190, incidents: 78 },
    { date: 'Semaine 7', nouveauxUtilisateurs: 280, utilisateursActifs: 230, incidents: 92 },
    { date: 'Semaine 8', nouveauxUtilisateurs: 320, utilisateursActifs: 260, incidents: 105 },
  ];
  
  // Données simulées pour la corrélation entre sévérité et engagement des utilisateurs
  const severityEngagementData = [
    { severity: 'Mineur', upvotes: 15, comments: 2, size: 120 },
    { severity: 'Mineur', upvotes: 22, comments: 5, size: 150 },
    { severity: 'Mineur', upvotes: 18, comments: 3, size: 130 },
    { severity: 'Moyen', upvotes: 32, comments: 8, size: 180 },
    { severity: 'Moyen', upvotes: 45, comments: 12, size: 220 },
    { severity: 'Moyen', upvotes: 38, comments: 10, size: 200 },
    { severity: 'Majeur', upvotes: 65, comments: 18, size: 280 },
    { severity: 'Majeur', upvotes: 72, comments: 22, size: 320 },
    { severity: 'Majeur', upvotes: 58, comments: 15, size: 260 },
    { severity: 'Critique', upvotes: 95, comments: 35, size: 400 },
    { severity: 'Critique', upvotes: 110, comments: 42, size: 450 },
    { severity: 'Critique', upvotes: 85, comments: 28, size: 380 },
  ];
  
  // Fonction pour obtenir les données actuelles en fonction de la période sélectionnée
  const getCurrentIncidentsByTypeData = () => {
    return incidentsByTypeData[period];
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistiques</h1>
        <p className="text-gray-500">Analysez les tendances et performances de la plateforme</p>
      </div>
      
      {/* Contrôles pour la période et l'export */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <Select value={period} onValueChange={(value: TimePeriod) => setPeriod(value)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter les données
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-5 mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="regions">Régions</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        
        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {/* Activité par jour */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Activité quotidienne
              </CardTitle>
              <CardDescription>Comparaison des incidents, commentaires et utilisateurs actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={activityByDayData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incidents" name="Incidents" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="comments" name="Commentaires" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="users" name="Utilisateurs actifs" stroke="#F59E0B" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Distribution des types d'incidents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-blue-600" />
                  Types d'incidents
                </CardTitle>
                <CardDescription>Répartition par catégorie pour {period === 'day' ? 'aujourd\'hui' : period === 'week' ? 'cette semaine' : period === 'month' ? 'ce mois' : 'cette année'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getCurrentIncidentsByTypeData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {getCurrentIncidentsByTypeData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} incidents`, 'Quantité']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Tendance mensuelle */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Évolution des incidents
                </CardTitle>
                <CardDescription>Tendances du mois d'avril 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <Tooltip />
                      <Area type="monotone" dataKey="incidents" stroke="#2563EB" fillOpacity={1} fill="url(#colorIncidents)" name="Incidents signalés" />
                      <Area type="monotone" dataKey="verified" stroke="#10B981" fillOpacity={1} fill="url(#colorVerified)" name="Incidents vérifiés" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Onglet Incidents */}
        <TabsContent value="incidents" className="space-y-6">
          {/* Évolution détaillée des incidents */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Évolution détaillée des incidents
              </CardTitle>
              <CardDescription>Analyse complète des signalements sur 30 jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="incidents" name="Incidents signalés" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="verified" name="Incidents vérifiés" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Types d'incidents */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Layers className="h-5 w-5 mr-2 text-blue-600" />
                Distribution par type d'incident
              </CardTitle>
              <CardDescription>Répartition des incidents par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCurrentIncidentsByTypeData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Nombre d'incidents" radius={[4, 4, 0, 0]}>
                      {getCurrentIncidentsByTypeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Utilisateurs */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Engagement des utilisateurs
              </CardTitle>
              <CardDescription>Évolution des nouveaux utilisateurs et utilisateurs actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={userEngagementData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nouveauxUtilisateurs" name="Nouveaux utilisateurs" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="utilisateursActifs" name="Utilisateurs actifs" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="incidents" name="Incidents signalés" stroke="#F59E0B" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Corrélation entre sévérité et engagement */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Corrélation entre sévérité et engagement
              </CardTitle>
              <CardDescription>Votes, commentaires et visibilité par niveau de sévérité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="upvotes" name="Votes positifs" />
                    <YAxis dataKey="comments" name="Commentaires" />
                    <ZAxis dataKey="size" range={[50, 500]} name="Visibilité" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value) => [value, '']} />
                    <Legend />
                    <Scatter
                      name="Incidents par sévérité"
                      data={severityEngagementData}
                      fill="#8884d8"
                    >
                      {severityEngagementData.map((entry, index) => {
                        let color;
                        switch (entry.severity) {
                          case 'Mineur': color = '#10B981'; break;
                          case 'Moyen': color = '#F59E0B'; break;
                          case 'Majeur': color = '#EF4444'; break;
                          case 'Critique': color = '#7F1D1D'; break;
                          default: color = '#6B7280';
                        }
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Régions */}
        <TabsContent value="regions" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Distribution géographique
              </CardTitle>
              <CardDescription>Répartition des incidents par région</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={regionData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={140} />
                    <Tooltip />
                    <Bar dataKey="count" name="Nombre d'incidents" fill="#2563EB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Engagement */}
        <TabsContent value="engagement" className="space-y-6">
          {/* Activité par jour */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Activité et engagement
              </CardTitle>
              <CardDescription>Vue d'ensemble de l'engagement des utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={activityByDayData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="users" name="Utilisateurs actifs" fill="#F59E0B" stroke="#F59E0B" fillOpacity={0.3} />
                    <Bar dataKey="incidents" name="Incidents" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="comments" name="Commentaires" stroke="#8B5CF6" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Corrélation entre sévérité et engagement */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Analyse détaillée de l'engagement
              </CardTitle>
              <CardDescription>Interaction des utilisateurs par type d'incident</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="upvotes" name="Votes positifs" />
                    <YAxis dataKey="comments" name="Commentaires" />
                    <ZAxis dataKey="size" range={[50, 500]} name="Visibilité" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value) => [value, '']} />
                    <Legend />
                    <Scatter
                      name="Incidents par sévérité"
                      data={severityEngagementData}
                      fill="#8884d8"
                    >
                      {severityEngagementData.map((entry, index) => {
                        let color;
                        switch (entry.severity) {
                          case 'Mineur': color = '#10B981'; break;
                          case 'Moyen': color = '#F59E0B'; break;
                          case 'Majeur': color = '#EF4444'; break;
                          case 'Critique': color = '#7F1D1D'; break;
                          default: color = '#6B7280';
                        }
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}