import { Router, Request, Response } from 'express';
import { verifyToken } from '../security/jwt';
import { getAllMessages, addMessage, getMessagesByMarkID } from '../model/db_messages';

const router = Router();

/**
 * GET /messages
 * Récupère tous les messages ou filtre par coordonnées
 * Accessible sans authentification
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { markerID } = req.query;

    // MarkerID est obligatoire ! Tu peux d'ailleurs utiliser mon middleware pour ne pas avoir à vérifier sa valeur et renvoyer un message d'erreur si non spécifié
    if (markerID) {
      const messages = getMessagesByMarkID(markerID as string);
      res.status(200).json(messages);
      return;
    }

    const messages = getAllMessages();
    res.status(200).json({
      "length": messages.length,
      "messages": messages,
      "connected": true,
    });
    return;

  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
    return
  }
});

/**
 * POST /messages
 * Ajoute un nouveau message (nécessite authentification)
 */
// router.post('/', verifyToken, (req: Request, res: Response) => {
//   try {
//     const { text, markerID } = req.body;

//     if (!text) {
//       res.status(400).json({ message: 'Le contenu du message est requis' });
//       return;
//     }

//     const user = req.user?.username;

//     if (!user) {
//       res.status(401).json({ message: 'Utilisateur non authentifié' });
//       return;
//     }

//     const newMessage = addMessage({
//       user,
//       text,
//       date: new Date().toISOString(),
//       markerID: markerID
//     });

//     res.status(201).json(newMessage);
//     return
//   } catch (error) {
//     console.error('Erreur lors de l\'ajout du message:', error);
//     res.status(500).json({ message: 'Erreur serveur' });
//     return;
//   }
// });

export default router;