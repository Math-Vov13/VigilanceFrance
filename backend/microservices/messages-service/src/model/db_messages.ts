export interface Message {
    id: number;
    user: string;
    text: string;
    date: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }
  
  let messagesDB: Message[] = [
    { id: 1, user: 'Marie L.', text: 'J\'ai été témoin, les secours sont arrivés rapidement', date: '2025-04-05T14:45:00', coordinates: { lat: 48.856614, lng: 2.3522219 } },
    { id: 2, user: 'Thomas R.', text: 'Attention, route bloquée sur l\'A7', date: '2025-04-06T10:15:00', coordinates: { lat: 48.855614, lng: 2.3422219 } },
    { id: 3, user: 'Sophie M.', text: 'Besoin d\'aide près de la gare centrale', date: '2025-04-06T11:30:00', coordinates: { lat: 48.859614, lng: 2.3622219 } },
    { id: 4, user: 'Lucas P.', text: 'Inondation signalée dans le quartier sud', date: '2025-04-07T09:20:00', coordinates: { lat: 48.852614, lng: 2.3522219 } },
    { id: 5, user: 'Emma D.', text: 'Tout est revenu à la normale près du parc', date: '2025-04-07T16:45:00', coordinates: { lat: 48.858614, lng: 2.3502219 } }
  ];
  
  export function getAllMessages(): { length: number, messages: Message[] } {
    return {
      length: messagesDB.length,
      messages: messagesDB
    };
  }
  
  export function getMessagesByCoordinates(lat: number, lng: number, radius: number = 10): { length: number, messages: Message[] } {

    const filteredMessages = messagesDB.filter(message => {
      if (!message.coordinates) return false;
      
      const distance = Math.sqrt(
        Math.pow((message.coordinates.lat - lat) * 111, 2) + 
        Math.pow((message.coordinates.lng - lng) * 111 * Math.cos(lat * Math.PI / 180), 2)
      );
      
      return distance <= radius;
    });
  
    return {
      length: filteredMessages.length,
      messages: filteredMessages
    };
  }
  
  export function addMessage(message: Omit<Message, 'id'>): Message {
    const newId = messagesDB.length > 0 ? Math.max(...messagesDB.map(m => m.id)) + 1 : 1;
    const newMessage: Message = { ...message, id: newId };
    messagesDB.push(newMessage);
    return newMessage;
  }
  
  export function getMessageById(id: number): Message | undefined {
    return messagesDB.find(message => message.id === id);
  }