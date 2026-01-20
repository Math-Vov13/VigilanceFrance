import { Router, Request, Response } from 'express';
import { createMessagesDoc, getMessagesByMarkID } from '../models/db_messages'; // getAllMessages : Optionel (l. 24)
import { verify_issue_id } from '../middlewares/verify_issue_query';
import { verify_access_token } from '../middlewares/verify_aToken';

const router = Router();

/**
 * GET /messages
 * Récupère tous les messages ou ceux liés à un markerID
 * Accessible sans authentification
 */
router.get('/', verify_access_token(false), verify_issue_id, async (req: Request, res: Response) => {
  const { issue_id } = req.query;

  try {
    let messages = await getMessagesByMarkID(issue_id as string);
    if (! messages) {
      console.error(`Document '${issue_id}' has not been created in collection!`);
      const newDoc = await createMessagesDoc(issue_id as string);
      console.log("Doc created:", newDoc);
    }
    
    res.status(200).json({
      connected: req.access_token_content !== undefined,
      id: issue_id,
      length: messages?.length || 0,
      messages: messages?.messages || new Array(),
    })

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
    return;
  }
});

export default router;
