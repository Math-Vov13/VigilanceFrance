import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Save, 
  X,
  Shield,
  Award,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Types
interface UserStats {
  incidentsReported: number;
  incidentsResolved: number;
  commentsPosted: number;
  upvotesReceived: number;
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    bio: ''
  });

  // Mock stats - En production, ces données viendraient de votre API
  const [stats] = useState<UserStats>({
    incidentsReported: 24,
    incidentsResolved: 18,
    commentsPosted: 156,
    upvotesReceived: 342
  });

  const [badges] = useState<string[]>([
    'Contributeur Actif', 
    'Expert Local', 
    'Première Alerte'
  ]);

  useEffect(() => {
    if (user) {
      setEditedUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'France',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Ici, vous feriez un appel API pour sauvegarder les modifications
    console.log('Saving profile:', editedUser);
    setIsEditing(false);
    // TODO: Mettre à jour le contexte AuthContext avec les nouvelles données
  };

  const handleCancel = () => {
    if (user) {
      setEditedUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'France',
        bio: user.bio || ''
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      'Contributeur Actif': 'from-blue-500 to-blue-600',
      'Expert Local': 'from-purple-500 to-purple-600',
      'Première Alerte': 'from-green-500 to-green-600'
    };
    return colors[badge] || 'from-gray-500 to-gray-600';
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <span className="ml-3 text-gray-300">Chargement du profil...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">Vous devez être connecté pour voir cette page</p>
          <a href="/auth" className="text-blue-400 hover:text-blue-300">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="glass-card-dark rounded-2xl overflow-hidden mb-6 shadow-2xl border border-gray-800">
          <div className="gradient-navbar h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6">
              {/* Avatar */}
              <div className="relative mb-4 sm:mb-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-1 shadow-2xl">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-300">
                        {getInitials()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900"></div>
              </div>

              {/* Name and Actions */}
              <div className="flex-1 sm:ml-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Membre depuis {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </p>
                  </div>
                  
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Modifier le profil
                    </button>
                  ) : (
                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              {isEditing ? (
                <textarea
                  value={editedUser.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Décrivez-vous..."
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">
                  {editedUser.bio || "Aucune biographie pour le moment."}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Badges */}
          <div className="lg:col-span-1 space-y-6">
            {/* Statistics */}
            <div className="glass-card-dark rounded-xl p-6 border border-gray-800 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Statistiques
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <span className="text-gray-300">Incidents signalés</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{stats.incidentsReported}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-gray-300">Résolus</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{stats.incidentsResolved}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-gray-300">Commentaires</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{stats.commentsPosted}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-gray-300">Votes reçus</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{stats.upvotesReceived}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="glass-card-dark rounded-xl p-6 border border-gray-800 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Badges
              </h2>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg bg-gradient-to-r ${getBadgeColor(badge)} hover:scale-105 transition-transform cursor-pointer`}
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Personal Information */}
          <div className="lg:col-span-2">
            <div className="glass-card-dark rounded-xl p-6 border border-gray-800 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Informations personnelles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white">{user.firstName}</span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white">{user.lastName}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <Mail className="w-5 h-5 text-purple-400" />
                      <span className="text-white">{user.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+33 6 12 34 56 78"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <Phone className="w-5 h-5 text-green-400" />
                      <span className="text-white">{user.phone || 'Non renseigné'}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Adresse
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123 Rue de la République"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-red-400" />
                      <span className="text-white">{user.address || 'Non renseignée'}</span>
                    </div>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Ville
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-orange-400" />
                      <span className="text-white">{user.city || 'Non renseignée'}</span>
                    </div>
                  )}
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Code postal
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">{user.postalCode || 'Non renseigné'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}