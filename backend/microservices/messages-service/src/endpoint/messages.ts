import { Router, Request, Response } from 'express';
import { verifyToken } from '../security/jwt';
import { getAllMessages, getMessagesByCoordinates, addMessage } from '../model/db_messages';

const router = Router();

/**
 * GET /messages
 * Récupère tous les messages ou filtre par coordonnées
 */
router.get('/', verifyToken, (req: Request, res: Response) => {
  try {
    const { lat, lng, radius } = req.query;

    if (lat && lng) {
      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      const radiusValue = radius ? parseFloat(radius as string) : 10;

      if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusValue)) {
        res.status(400).json({ message: 'Coordonnées invalides' });
        return;
      }

      const messages = getMessagesByCoordinates(latitude, longitude, radiusValue);
      res.status(200).json(messages);
      return;
    }

    const messages = getAllMessages();
    res.status(200).json(messages);
    return
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
    return
  }
});

/**
 * POST /messages
 * Ajoute un nouveau message
 */
router.post('/', verifyToken, (req: Request, res: Response) => {
  try {
    const { text, coordinates } = req.body;

    if (!text) {
      res.status(400).json({ message: 'Le contenu du message est requis' });
      return;
    }

    const user = req.user?.username;

    if (!user) {
      res.status(401).json({ message: 'Utilisateur non authentifié' });
      return;
    }

    const newMessage = addMessage({
      user,
      text,
      date: new Date().toISOString(),
      coordinates,
    });

    res.status(201).json(newMessage);
    return
  } catch (error) {
    console.error('Erreur lors de l\'ajout du message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
    return;
  }
});

export default router;
