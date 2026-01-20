import { IncidentTypeInfo, SeverityLevel, IncidentStatusInfo } from '../types';


export const incidentTypes: IncidentTypeInfo[] = [
    { value: 'accident', label: 'Road Accident', color: '#FF5722', icon:'auto-crash' },
    { value: 'inondation', label: 'Flood', color: '#2196F3', icon: 'flood' },
    { value: 'incendie', label: 'Fire', color: '#F44336', icon: 'flame' },
    { value: 'vol', label: 'Theft/Burglary', color: '#9C27B0', icon: 'robbery' },
    { value: 'agression', label: 'Assault', color: '#E91E63', icon: 'assault' },
    { value: 'manifestation', label: 'Demonstration', color: '#FF9800', icon: 'movement' },
    { value: 'panne', label: 'Breakdown', color: '#607D8B', icon: 'breakdown' },
    { value: 'pollution', label: 'Air Pollution', color: '#795548', icon: 'air-pollution' },
    { value: 'autre', label: 'Other Incident', color: '#9E9E9E', icon: 'others' }
  ];
  
export const severityLevels: SeverityLevel[] = [
    { value: 'mineur', label: 'Minor', color: '#8BC34A' },
    { value: 'moyen', label: 'Medium', color: '#FFC107' },
    { value: 'majeur', label: 'Major', color: '#FF5722' },
    { value: 'critique', label: 'Critical', color: '#F44336' }
];
  
export const defaultMapCenter = { lat: 46.603354, lng: 1.888334 }; // Center of France
export const defaultMapZoom = 6;

export const commentReportReasons = [
  { value: 'spam', label: 'Spam ou publicité' },
  { value: 'inappropriate', label: 'Contenu inapproprié' },
  { value: 'harassment', label: 'Harcèlement' },
  { value: 'false', label: 'Information fausse' },
  { value: 'other', label: 'Autre raison' }
];

// Incident status types
export const incidentStatusTypes: IncidentStatusInfo[] = [
  { value: 'active', label: 'En cours', color: '#F44336' },
  { value: 'verified', label: 'Vérifié', color: '#4CAF50' },
  { value: 'resolved', label: 'Résolu', color: '#2196F3' },
  { value: 'unverified', label: 'Non vérifié', color: '#FFC107' }
];