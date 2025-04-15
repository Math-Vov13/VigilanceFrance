import { z } from "zod";
import { IMessage, MessagesModel } from "../schemas/mongo_messages_sc";
import { message } from "../schemas/message_sc";


// let messagesDB: Message[] = [
//   { id: 1, user: 'Marie L.', text: 'J\'ai été témoin, les secours sont arrivés rapidement', date: '2025-04-05T14:45:00', markerID: 'zieyc7' },
//   { id: 2, user: 'Thomas R.', text: 'Attention, route bloquée sur l\'A7', date: '2025-04-06T10:15:00', markerID: 'ao2uee' },
//   { id: 3, user: 'Sophie M.', text: 'Besoin d\'aide près de la gare centrale', date: '2025-04-06T11:30:00', markerID: 'deto42'  },
//   { id: 4, user: 'Lucas P.', text: 'Inondation signalée dans le quartier sud', date: '2025-04-07T09:20:00', markerID: 'izdy47' },
//   { id: 5, user: 'Emma D.', text: 'Tout est revenu à la normale près du parc', date: '2025-04-07T16:45:00', markerID: 'kfe724' },
//   { id: 6, user: 'Nora G.', text: 'Forte fumée près du centre commercial', date: '2025-04-08T08:30:00', markerID: 'jd92ks' },
//   { id: 7, user: 'Antoine V.', text: 'Plus de réseau dans le quartier nord', date: '2025-04-08T09:05:00', markerID: 'pq73lm' },
//   { id: 8, user: 'Leïla S.', text: 'Un arbre est tombé sur la route', date: '2025-04-08T12:40:00', markerID: 'mnf32d' },
//   { id: 9, user: 'Hugo T.', text: 'Présence policière importante rue Victor Hugo', date: '2025-04-08T15:20:00', markerID: 'bvt541' },
//   { id: 10, user: 'Sophie M.', text: 'Attention, route bloquée sur l\'A7', date: '2025-04-09T10:15:00', markerID: 'ao2uee' },
//   { id: 17, user: 'Élodie H.', text: 'Les pompiers sont sur place, tout va bien', date: '2025-04-09T13:30:00', markerID: 'plm258' },
//   { id: 18, user: 'Rayan C.', text: 'Plusieurs voitures piégées dans le sous-sol', date: '2025-04-09T14:15:00', markerID: 'ijn369' },
//   { id: 19, user: 'Anaïs Z.', text: 'Des familles ont été évacuées vers le gymnase', date: '2025-04-09T15:00:00', markerID: 'uhb147' },
//   { id: 20, user: 'Nathan D.', text: 'Un câble électrique est tombé, danger', date: '2025-04-09T16:20:00', markerID: 'ytg963' }
// ];

// export function getAllMessages(): { length: number, messages: Message[] } {
//   return {
//     messages: messagesDB,
//     length: messagesDB.length
//   };
// }

export async function createMessagesDoc(issue_id: string): Promise<IMessage | null> {
  try {
    return await MessagesModel.create({
      "issue_id": issue_id,
      "content": [

      ]
    })
  } catch (err) {
    console.log("CONFLICT:", err);
    return null;
  }
}

export async function getMessagesByMarkID(markerID: string): Promise<{ length: number, messages: z.infer<typeof message>[] } | null> {
  try {
    const messages = await MessagesModel.findOne({ issue_id: markerID }, { content: 1 }) as IMessage;
    if (! messages) {
      return null;
    }

    // const messages = messagesDB.filter(message => message.markerID === markerID);

    return {
      length: messages.content.length,
      messages: messages.content
    };
  } catch(err) {
    console.log("NOT FOUND:", err);
    return null;
  }
}

export async function addMessage(issue_id: string, user_id: string, lastName: string, firstName: string, content: string): Promise<z.infer<typeof message> | null> {
  try {
    const messages = await MessagesModel.findById(issue_id) as IMessage;
    if (! messages) {
      return null;
    }

    const data = {
      "user_id": user_id,
      "lastName": lastName,
      "firstName": firstName,
      "message": content,
      "created_at": new Date()
    }

    messages.content.push(data);
    await messages.save();

    // const newId = messagesDB.length > 0 ? Math.max(...messagesDB.map(m => m.id)) + 1 : 1;
    // const newMessage: Message = { ...message, id: newId };
    // messagesDB.push(newMessage);
    return data;
  } catch(err) {
    console.log("CONFLICT:", err);
    return null;
  }
}