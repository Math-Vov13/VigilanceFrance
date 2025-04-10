// Type definitions for incident categories
export const incidentTypes = [
    { value: 'accident', label: 'Accident de la route', color: '#FF5722', icon: 'car-crash' },
    { value: 'inondation', label: 'Inondation', color: '#2196F3', icon: 'droplet' },
    { value: 'incendie', label: 'Incendie', color: '#F44336', icon: 'flame' },
    { value: 'vol', label: 'Vol/Cambriolage', color: '#9C27B0', icon: 'shield-off' },
    { value: 'agression', label: 'Agression', color: '#E91E63', icon: 'alert-triangle' },
    { value: 'manifestation', label: 'Manifestation', color: '#FF9800', icon: 'users' },
    { value: 'panne', label: 'Panne/Coupure', color: '#607D8B', icon: 'zap-off' },
    { value: 'pollution', label: 'Pollution', color: '#795548', icon: 'cloud-off' },
    { value: 'autre', label: 'Autre incident', color: '#9E9E9E', icon: 'alert-circle' }
  ];
  
  // Severity levels
  export const severityLevels = [
    { value: 'mineur', label: 'Mineur', color: '#8BC34A' },
    { value: 'moyen', label: 'Moyen', color: '#FFC107' },
    { value: 'majeur', label: 'Majeur', color: '#FF5722' },
    { value: 'critique', label: 'Critique', color: '#F44336' }
  ];
  
  // Map settings
  export const defaultMapCenter = { lat: 46.603354, lng: 1.888334 }; // Center of France
  export const defaultMapZoom = 6;
  
  // Comment report types
  export const commentReportReasons = [
    { value: 'spam', label: 'Spam ou publicité' },
    { value: 'inappropriate', label: 'Contenu inapproprié' },
    { value: 'harassment', label: 'Harcèlement' },
    { value: 'false', label: 'Information fausse' },
    { value: 'other', label: 'Autre raison' }
  ];
  
  // Incident status types
  export const incidentStatusTypes = [
    { value: 'active', label: 'En cours', color: '#F44336' },
    { value: 'verified', label: 'Vérifié', color: '#4CAF50' },
    { value: 'resolved', label: 'Résolu', color: '#2196F3' },
    { value: 'unverified', label: 'Non vérifié', color: '#FFC107' }
  ];