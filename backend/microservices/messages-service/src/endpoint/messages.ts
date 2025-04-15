import { Router, Request, Response } from 'express';
import { getAllMessages, getMessagesByMarkID } from '../dbtest/db_messages'; // getAllMessages : Optionel (l. 24)

const router = Router();

/**
 * GET /messages
 * Récupère tous les messages ou ceux liés à un markerID
 * Accessible sans authentification
 */
router.get('/', async (req: Request, res: Response) => {
  const { markerID } = req.query;

  try {
    if (typeof markerID === "string" && markerID.trim() !== "") { // Si y a un markerID
      const messages = await getMessagesByMarkID(markerID);
      res.status(200).json({
        markerID,
        length: messages.length,
        messages,
      })
      return ;
    }
    /*         Logique, obtenir tout les messages (Optionnel)
    const messages = await getAllMessages();
    res.status(200).json({
      length: messages.length,
      messages,
    })
    return;
    */
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ message: 'Erreur serveur' })
    return ;
  }
});

export default router;
