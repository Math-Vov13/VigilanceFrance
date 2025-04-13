import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/use-toast';
import {
  MoreVertical,
  CheckCircle,
  XCircle,
  Flag,
  MessageSquare,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Eye,
  Trash2,
  Shield,
} from 'lucide-react';
import { Avatar, AvatarFallback} from '../../components/ui/avatar';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { sampleIncidents } from '../../data/sampleData';
import { Comment } from '../../types';

// Types pour les signalements
interface Report {
  id: string;
  type: 'incident' | 'comment' | 'user';
  reason: string;
  reportedAt: string;
  reportedBy: string;
  status: 'pending' | 'resolved' | 'rejected';
  
  // Pour les incidents
  incidentId?: number;
  incidentTitle?: string;
  
  // Pour les commentaires
  commentId?: number;
  commentText?: string;
  commentUser?: string;
  
  // Pour les utilisateurs
  userId?: string;
  username?: string;
  userEmail?: string;
}

// Générer des signalements fictifs
const generateSampleReports = (): Report[] => {
  const reports: Report[] = [];
  
  // Signalements d'incidents
  sampleIncidents.slice(0, 5).forEach((incident, index) => {
    reports.push({
      id: `inc-${index + 1}`,
      type: 'incident',
      reason: ['Contenu inapproprié', 'Information incorrecte', 'Spam', 'Autre raison'][Math.floor(Math.random() * 4)],
      reportedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // 0-7 jours aléatoires dans le passé
      reportedBy: ['Jean D.', 'Marie L.', 'Thomas B.', 'Sophie M.', 'Pierre L.'][Math.floor(Math.random() * 5)],
      status: ['pending', 'pending', 'pending', 'resolved', 'rejected'][Math.floor(Math.random() * 5)] as 'pending' | 'resolved' | 'rejected',
      incidentId: incident.id,
      incidentTitle: incident.title,
    });
  });
  
  // Signalements de commentaires
  const allComments: { comment: Comment, incidentId: number, incidentTitle: string }[] = [];
  sampleIncidents.forEach(incident => {
    incident.comments.forEach(comment => {
      allComments.push({
        comment,
        incidentId: incident.id,
        incidentTitle: incident.title,
      });
    });
  });
  
  allComments.slice(0, 10).forEach((item, index) => {
    reports.push({
      id: `com-${index + 1}`,
      type: 'comment',
      reason: ['Contenu inapproprié', 'Harcèlement', 'Spam', 'Fausses informations'][Math.floor(Math.random() * 4)],
      reportedAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(), // 0-5 jours aléatoires dans le passé
      reportedBy: ['Jean D.', 'Marie L.', 'Thomas B.', 'Sophie M.', 'Pierre L.'][Math.floor(Math.random() * 5)],
      status: ['pending', 'pending', 'pending', 'pending', 'resolved', 'rejected'][Math.floor(Math.random() * 6)] as 'pending' | 'resolved' | 'rejected',
      incidentId: item.incidentId,
      incidentTitle: item.incidentTitle,
      commentId: item.comment.id,
      commentText: item.comment.text,
      commentUser: item.comment.user,
    });
  });
  
  // Signalements d'utilisateurs
  const usernames = ['jean.dupont', 'marie.laurent', 'thomas.bernard', 'sophie.martin', 'nicolas.petit'];
  const emails = ['jean.dupont@example.com', 'marie.laurent@example.com', 'thomas.bernard@example.com', 'sophie.martin@example.com', 'nicolas.petit@example.com'];
  
  usernames.forEach((username, index) => {
    reports.push({
      id: `user-${index + 1}`,
      type: 'user',
      reason: ['Comportement inapproprié', 'Usurpation d\'identité', 'Spam', 'Harcèlement'][Math.floor(Math.random() * 4)],
      reportedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(), // 0-10 jours aléatoires dans le passé
      reportedBy: ['Jean D.', 'Marie L.', 'Thomas B.', 'Sophie M.', 'Pierre L.'][Math.floor(Math.random() * 5)],
      status: ['pending', 'pending', 'pending', 'resolved', 'rejected'][Math.floor(Math.random() * 5)] as 'pending' | 'resolved' | 'rejected',
      userId: (index + 1).toString(),
      username: username,
      userEmail: emails[index],
    });
  });
  
  return reports;
};

export function AdminModeration() {
  const [reports, setReports] = useState<Report[]>(generateSampleReports());
  const [currentTab, setCurrentTab] = useState('pending');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject'>('approve');
  
  const { toast } = useToast();
  
  // Filtrer les signalements par statut
  const pendingReports = reports.filter(report => report.status === 'pending');
  const resolvedReports = reports.filter(report => report.status === 'resolved');
  const rejectedReports = reports.filter(report => report.status === 'rejected');
  
  // Formater la date relative
  const formatRelativeDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
  // Formater la date complète
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPp', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
  // Obtenir les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Ouvrir la boîte de dialogue de modération
  const openModerationDialog = (report: Report, action: 'approve' | 'reject') => {
    setSelectedReport(report);
    setDialogAction(action);
    setModerationNote('');
    setShowDialog(true);
  };
  
  // Approuver un signalement
  const handleApproveReport = () => {
    if (!selectedReport) return;
    
    setReports(reports.map(report => 
      report.id === selectedReport.id
        ? { ...report, status: 'resolved' }
        : report
    ));
    
    setShowDialog(false);
    
    toast({
      title: 'Signalement résolu',
      description: 'Le signalement a été approuvé et marqué comme résolu.',
    });
  };
  
  // Rejeter un signalement
  const handleRejectReport = () => {
    if (!selectedReport) return;
    
    setReports(reports.map(report => 
      report.id === selectedReport.id
        ? { ...report, status: 'rejected' }
        : report
    ));
    
    setShowDialog(false);
    
    toast({
      title: 'Signalement rejeté',
      description: 'Le signalement a été rejeté et aucune action n\'a été prise.',
    });
  };
  
  // Type de badge pour le type de signalement
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'incident':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Incident</Badge>;
      case 'comment':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Commentaire</Badge>;
      case 'user':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Utilisateur</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };
  
  // Badge pour le statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Résolu</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeté</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  // Rendu d'un signalement d'incident
  const renderIncidentReport = (report: Report) => (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-0">
      <div className="bg-blue-100 p-2 rounded-full">
        <MapPin className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{report.incidentTitle}</p>
            <p className="text-sm text-gray-500 mt-1">
              Signalé pour: <span className="font-medium">{report.reason}</span>
            </p>
          </div>
          {currentTab === 'pending' && (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => openModerationDialog(report, 'approve')}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approuver
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => openModerationDialog(report, 'reject')}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejeter
              </Button>
            </div>
          )}
          {currentTab !== 'pending' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir l'incident
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Voir le signalement
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-3 justify-between">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>Signalé par {report.reportedBy}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span title={formatDate(report.reportedAt)}>{formatRelativeDate(report.reportedAt)}</span>
          </div>
          {getStatusBadge(report.status)}
        </div>
      </div>
    </div>
  );

  // Rendu d'un signalement de commentaire
  const renderCommentReport = (report: Report) => (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-0">
      <div className="bg-purple-100 p-2 rounded-full">
        <MessageSquare className="h-5 w-5 text-purple-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Commentaire sur "{report.incidentTitle}"</p>
            <div className="bg-gray-50 p-3 rounded-md my-2 text-sm">
              <p className="font-medium text-gray-700">{report.commentUser} :</p>
              <p className="text-gray-600 mt-1">{report.commentText}</p>
            </div>
            <p className="text-sm text-gray-500">
              Signalé pour: <span className="font-medium">{report.reason}</span>
            </p>
          </div>
          {currentTab === 'pending' && (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => openModerationDialog(report, 'approve')}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approuver
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => openModerationDialog(report, 'reject')}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejeter
              </Button>
            </div>
          )}
          {currentTab !== 'pending' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir l'incident
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer le commentaire
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Voir le signalement
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-3 justify-between">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>Signalé par {report.reportedBy}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span title={formatDate(report.reportedAt)}>{formatRelativeDate(report.reportedAt)}</span>
          </div>
          {getStatusBadge(report.status)}
        </div>
      </div>
    </div>
  );

  // Rendu d'un signalement d'utilisateur
  const renderUserReport = (report: Report) => (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-0">
      <Avatar className="h-10 w-10">
        <AvatarFallback>{getInitials(report.username || '')}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{report.username}</p>
            <p className="text-sm text-gray-500">{report.userEmail}</p>
            <p className="text-sm text-gray-500 mt-2">
              Signalé pour: <span className="font-medium">{report.reason}</span>
            </p>
          </div>
          {currentTab === 'pending' && (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => openModerationDialog(report, 'approve')}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approuver
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => openModerationDialog(report, 'reject')}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejeter
              </Button>
            </div>
          )}
          {currentTab !== 'pending' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir le profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="h-4 w-4 mr-2" />
                  Suspendre l'utilisateur
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Voir le signalement
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-3 justify-between">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>Signalé par {report.reportedBy}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span title={formatDate(report.reportedAt)}>{formatRelativeDate(report.reportedAt)}</span>
          </div>
          {getStatusBadge(report.status)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Modération</h1>
        <p className="text-gray-500">Gérez les signalements d'incidents, commentaires et utilisateurs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              En attente
            </CardTitle>
            <CardDescription>{pendingReports.length} signalements à examiner</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              Résolus
            </CardTitle>
            <CardDescription>{resolvedReports.length} signalements approuvés</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <XCircle className="h-5 w-5 mr-2" />
              Rejetés
            </CardTitle>
            <CardDescription>{rejectedReports.length} signalements rejetés</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Signalements</CardTitle>
          <CardDescription>Examinez et traitez les signalements des utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="pending" className="flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                En attente ({pendingReports.length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Résolus ({resolvedReports.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center justify-center">
                <XCircle className="h-4 w-4 mr-2" />
                Rejetés ({rejectedReports.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-4">
              {pendingReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <CheckCircle className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">Aucun signalement en attente</p>
                  <p className="text-sm">Tous les signalements ont été traités.</p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500">
                      {pendingReports.length} signalements en attente de modération
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Tous approuver
                      </Button>
                      <Button variant="outline" size="sm">
                        Tous rejeter
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {pendingReports.map(report => (
                      <Card key={report.id}>
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-2">
                              {getTypeBadge(report.type)}
                              <span className="text-sm font-medium">
                                ID: {report.id}
                              </span>
                            </div>
                            <div>
                              {getStatusBadge(report.status)}
                            </div>
                          </div>
                          {report.type === 'incident' && renderIncidentReport(report)}
                          {report.type === 'comment' && renderCommentReport(report)}
                          {report.type === 'user' && renderUserReport(report)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="resolved" className="space-y-4">
              {resolvedReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <CheckCircle className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">Aucun signalement résolu</p>
                  <p className="text-sm">Aucun signalement n'a encore été approuvé.</p>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-gray-500 mb-4">
                    {resolvedReports.length} signalements résolus
                  </div>
                  <div className="space-y-2">
                    {resolvedReports.map(report => (
                      <Card key={report.id}>
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-2">
                              {getTypeBadge(report.type)}
                              <span className="text-sm font-medium">
                                ID: {report.id}
                              </span>
                            </div>
                            <div>
                              {getStatusBadge(report.status)}
                            </div>
                          </div>
                          {report.type === 'incident' && renderIncidentReport(report)}
                          {report.type === 'comment' && renderCommentReport(report)}
                          {report.type === 'user' && renderUserReport(report)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rejected" className="space-y-4">
              {rejectedReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <XCircle className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">Aucun signalement rejeté</p>
                  <p className="text-sm">Aucun signalement n'a encore été rejeté.</p>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-gray-500 mb-4">
                    {rejectedReports.length} signalements rejetés
                  </div>
                  <div className="space-y-2">
                    {rejectedReports.map(report => (
                      <Card key={report.id}>
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-2">
                              {getTypeBadge(report.type)}
                              <span className="text-sm font-medium">
                                ID: {report.id}
                              </span>
                            </div>
                            <div>
                              {getStatusBadge(report.status)}
                            </div>
                          </div>
                          {report.type === 'incident' && renderIncidentReport(report)}
                          {report.type === 'comment' && renderCommentReport(report)}
                          {report.type === 'user' && renderUserReport(report)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Dialogue de modération */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approuver le signalement' : 'Rejeter le signalement'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve' 
                ? 'Le signalement sera marqué comme résolu et des mesures appropriées seront prises.' 
                : 'Le signalement sera rejeté et aucune mesure ne sera prise.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="py-4">
              <div className="flex items-center space-x-2 mb-4">
                {getTypeBadge(selectedReport.type)}
                <span className="font-medium">
                  {selectedReport.type === 'incident' && selectedReport.incidentTitle}
                  {selectedReport.type === 'comment' && `Commentaire de ${selectedReport.commentUser}`}
                  {selectedReport.type === 'user' && selectedReport.username}
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <p className="text-sm font-medium">Motif du signalement:</p>
                <p className="text-sm">{selectedReport.reason}</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="moderationNote">Note de modération (optionnelle)</Label>
                  <Textarea
                    id="moderationNote"
                    placeholder="Ajoutez des détails sur votre décision..."
                    value={moderationNote}
                    onChange={(e) => setModerationNote(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
            {dialogAction === 'approve' ? (
              <Button onClick={handleApproveReport} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approuver
              </Button>
            ) : (
              <Button onClick={handleRejectReport} className="bg-red-600 hover:bg-red-700">
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}