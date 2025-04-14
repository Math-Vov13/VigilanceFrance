export interface Message {
  id: number;
  user: string;
  text: string;
  date: string;
  markerID: string;
}

let messagesDB: Message[] = [
  { id: 1, user: 'Marie L.', text: 'J\'ai été témoin, les secours sont arrivés rapidement', date: '2025-04-05T14:45:00', markerID: 'zieyc7' },
  { id: 2, user: 'Thomas R.', text: 'Attention, route bloquée sur l\'A7', date: '2025-04-06T10:15:00', markerID: 'ao2uee' },
  { id: 3, user: 'Sophie M.', text: 'Besoin d\'aide près de la gare centrale', date: '2025-04-06T11:30:00', markerID: 'deto42'  },
  { id: 4, user: 'Lucas P.', text: 'Inondation signalée dans le quartier sud', date: '2025-04-07T09:20:00', markerID: 'izdy47' },
  { id: 5, user: 'Emma D.', text: 'Tout est revenu à la normale près du parc', date: '2025-04-07T16:45:00', markerID: 'kfe724' },
  { id: 6, user: 'Nora G.', text: 'Forte fumée près du centre commercial', date: '2025-04-08T08:30:00', markerID: 'jd92ks' },
  { id: 7, user: 'Antoine V.', text: 'Plus de réseau dans le quartier nord', date: '2025-04-08T09:05:00', markerID: 'pq73lm' },
  { id: 8, user: 'Leïla S.', text: 'Un arbre est tombé sur la route', date: '2025-04-08T12:40:00', markerID: 'mnf32d' },
  { id: 9, user: 'Hugo T.', text: 'Présence policière importante rue Victor Hugo', date: '2025-04-08T15:20:00', markerID: 'bvt541' },
  { id: 10, user: 'Sophie M.', text: 'Attention, route bloquée sur l\'A7', date: '2025-04-09T10:15:00', markerID: 'ao2uee' },
  { id: 17, user: 'Élodie H.', text: 'Les pompiers sont sur place, tout va bien', date: '2025-04-09T13:30:00', markerID: 'plm258' },
  { id: 18, user: 'Rayan C.', text: 'Plusieurs voitures piégées dans le sous-sol', date: '2025-04-09T14:15:00', markerID: 'ijn369' },
  { id: 19, user: 'Anaïs Z.', text: 'Des familles ont été évacuées vers le gymnase', date: '2025-04-09T15:00:00', markerID: 'uhb147' },
  { id: 20, user: 'Nathan D.', text: 'Un câble électrique est tombé, danger', date: '2025-04-09T16:20:00', markerID: 'ytg963' }
];

export function getAllMessages(): { length: number, messages: Message[] } {
  return {
    messages: messagesDB,
    length: messagesDB.length
  };
}

export function getMessagesByMarkID(markerID: string): { length: number, messages: Message[] } {
  const MarkIDMessages = messagesDB.filter(message => message.markerID === markerID);
  return {
    length: MarkIDMessages.length,
    messages: MarkIDMessages
  };
}


export function addMessage(message: Omit<Message, 'id'>): Message {
  const newId = messagesDB.length > 0 ? Math.max(...messagesDB.map(m => m.id)) + 1 : 1;
  const newMessage: Message = { ...message, id: newId };
  messagesDB.push(newMessage);

  return newMessage;
}