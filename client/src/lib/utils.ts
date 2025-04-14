import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get severity color class
export function getSeverityColor(severity: string) {
  switch(severity) {
    case 'mineur': return 'bg-yellow-500';
    case 'moyen': return 'bg-orange-500';
    case 'majeur': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

// Get severity label
export function getSeverityLabel(severity: string) {
  switch(severity) {
    case 'mineur': return 'Mineur';
    case 'moyen': return 'Moyen';
    case 'majeur': return 'Majeur';
    default: return 'Inconnu';
  }
}

// Get incident type label
export function getIncidentTypeLabel(type: string) {
  switch(type) {
    case 'accident': return 'Accident';
    case 'inondation': return 'Inondation';
    case 'vol': return 'Vol';
    case 'agression': return 'Agression';
    case 'incendie': return 'Incendie';
    default: return 'Autre';
  }
}