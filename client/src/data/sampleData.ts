import { Incident } from '../types';

// Sample incident data for development
export const sampleIncidents: Incident[] = [
  {
    id: 1,
    type: 'accident',
    title: 'Accident de la route',
    description: 'Collision entre deux véhicules sur l\'autoroute A1. Un camion et une voiture sont impliqués. Les secours sont sur place et la circulation est ralentie sur 2km.',
    location: 'Autoroute A1, Paris Nord',
    coordinates: { lat: 48.856614, lng: 2.3522219 }, // Paris coordinates
    severity: 'moyen',
    status: 'active',
    upvotes: 12,
    downvotes: 2,
    comments: [
      { id: 1, user: 'Marie L.', text: 'J\'ai été témoin, les secours sont arrivés rapidement. Prudence si vous prenez cette route.', date: '2025-04-05T14:45:00', likes: 3 },
      { id: 2, user: 'Thomas B.', text: 'La circulation a été rétablie vers 16h mais reste difficile dans le secteur.', date: '2025-04-05T16:15:00', likes: 5 }
    ],
    imageUrls: [
      '/assets/images/sample/accident1.jpg',
      '/assets/images/sample/accident2.jpg'
    ]
  },
  {
    id: 2,
    type: 'inondation',
    title: 'Inondation rue principale',
    description: 'Suite aux fortes pluies, la rue principale est inondée sur 200m. L\'eau atteint 30cm par endroits et plusieurs commerces sont touchés. La mairie a mis en place des passerelles temporaires.',
    location: 'Rue de la République, Lyon 69002',
    coordinates: { lat: 45.764043, lng: 4.835659 }, // Lyon coordinates
    severity: 'moyen',
    status: 'verified',
    upvotes: 28,
    downvotes: 0,
    comments: [
      { id: 1, user: 'Pierre D.', text: 'Le niveau d\'eau continue de monter, les pompiers évacuent certains immeubles.', date: '2025-04-06T09:30:00', likes: 7 },
      { id: 2, user: 'Laura T.', text: 'La mairie distribue des sacs de sable au gymnase central pour les riverains.', date: '2025-04-06T11:15:00', likes: 12 }
    ],
    imageUrls: [
      '/assets/images/sample/flood1.jpg',
      '/assets/images/sample/flood2.jpg'
    ]
  },
  {
    id: 3,
    type: 'vol',
    title: 'Vol à l\'arraché',
    description: 'Téléphone portable volé sur la place du marché. Le suspect est un homme d\'environ 25 ans, vêtu d\'un sweat à capuche noir. Il s\'est enfui en direction du Vieux-Port.',
    location: 'Place du marché, Marseille 13001',
    coordinates: { lat: 43.296482, lng: 5.369780 }, // Marseille coordinates
    severity: 'faible',
    status: 'unverified',
    upvotes: 5,
    downvotes: 1,
    comments: []
  },
  {
    id: 4,
    type: 'agression',
    title: 'Agression dans le métro',
    description: 'Une personne a été agressée à la station République. La police est intervenue rapidement et a interpellé l\'agresseur. La victime a été prise en charge par les secours.',
    location: 'Station République, Paris 75011',
    coordinates: { lat: 48.867748, lng: 2.362087 }, // Paris République coordinates
    severity: 'moyen',
    status: 'resolved',
    upvotes: 32,
    downvotes: 3,
    comments: [
      { id: 1, user: 'Marc B.', text: 'J\'étais présent, la sécurité du métro a été très réactive.', date: '2025-04-04T22:30:00', likes: 8 },
      { id: 2, user: 'Julie M.', text: 'La station a été fermée pendant 45 minutes environ.', date: '2025-04-04T23:00:00', likes: 4 }
    ]
  },
  {
    id: 5,
    type: 'incendie',
    title: 'Incendie dans un immeuble',
    description: 'Un incendie s\'est déclaré au 3ème étage d\'un immeuble résidentiel. Les pompiers sont sur place avec 5 camions et ont évacué tout l\'immeuble. Des rues adjacentes sont bloquées.',
    location: 'Rue Sainte-Catherine, Bordeaux 33000',
    coordinates: { lat: 44.837789, lng: -0.579180 },
    severity: 'élevé',
    status: 'active',
    upvotes: 45,
    downvotes: 0,
    comments: [
      { id: 1, user: 'Lucie B.', text: 'Tous les habitants ont été évacués, pas de blessés signalés pour l\'instant.', date: '2025-04-03T15:10:00', likes: 15 },
      { id: 2, user: 'Éric P.', text: 'La mairie a ouvert un centre d\'accueil pour les familles évacuées à l\'école Pasteur.', date: '2025-04-03T16:30:00', likes: 22 },
      { id: 3, user: 'Christine M.', text: 'L\'incendie est maintenant maîtrisé mais les pompiers restent sur place.', date: '2025-04-03T18:45:00', likes: 10 }
    ],
    imageUrls: [
      '/assets/images/sample/fire1.jpg',
      '/assets/images/sample/fire2.jpg'
    ]
  },
  {
    id: 6,
    type: 'manifestation',
    title: 'Manifestation centre-ville',
    description: 'Manifestation importante prévue aujourd\'hui. Le cortège partira de la place de la République à 14h et se dirigera vers l\'Hôtel de Ville. Plusieurs rues seront bloquées.',
    location: 'Place de la République, Paris 75003',
    coordinates: { lat: 48.867748, lng: 2.362087 }, // Paris République coordinates
    severity: 'moyen',
    status: 'verified',
    upvotes: 87,
    downvotes: 12,
    comments: [
      { id: 1, user: 'François L.', text: 'Prévoyez des itinéraires alternatifs si vous devez vous déplacer dans le secteur.', date: '2025-04-09T18:30:00', likes: 31 }
    ]
  },
  {
    id: 7,
    type: 'panne',
    title: 'Panne électrique',
    description: 'Coupure d\'électricité dans tout le quartier suite à un incident sur une ligne haute tension. Les techniciens sont sur place pour rétablir le courant.',
    location: 'Quartier Saint-Michel, Toulouse 31000',
    coordinates: { lat: 43.601373, lng: 1.442796 }, // Toulouse coordinates
    severity: 'moyen',
    status: 'resolved',
    upvotes: 19,
    downvotes: 0,
    comments: [
      { id: 1, user: 'Nathalie S.', text: 'L\'électricité vient d\'être rétablie dans mon immeuble.', date: '2025-04-07T21:30:00', likes: 5 },
      { id: 2, user: 'Hugo D.', text: 'Certains commerces restent fermés ce soir malgré le retour du courant.', date: '2025-04-07T22:00:00', likes: 3 }
    ]
  },
  {
    id: 8,
    type: 'accident',
    title: 'Accident de la route',
    description: 'Collision entre deux véhicules sur l\'autoroute A1. Un camion et une voiture sont impliqués. Les secours sont sur place et la circulation est ralentie sur 2km.',
    location: 'Autoroute A1, Paris Nord',
    coordinates: { lat: 48.856614, lng: 2.3522219 }, // Paris coordinates
    severity: 'moyen',
    status: 'active',
    upvotes: 12,
    downvotes: 2,
    comments: [
      { id: 1, user: 'Marie L.', text: 'J\'ai été témoin, les secours sont arrivés rapidement. Prudence si vous prenez cette route.', date: '2025-04-05T14:45:00', likes: 3 },
      { id: 2, user: 'Pierre M.', text: 'L\'accident est maintenant maîtrisé mais les secours restent sur place.', date: '2025-04-05T15:00:00', likes: 5 }
    ],
    imageUrls: [
      '/assets/images/sample/accident1.jpg',
      '/assets/images/sample/accident2.jpg' 
    ]
  }
];