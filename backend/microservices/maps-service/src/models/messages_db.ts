import { IMessage, MessagesModel } from "../schemas/mongo_messages_sc";

export async function createMessagesDoc(issue_id: string): Promise<IMessage | null> {
  try {
    return await MessagesModel.create({
      "issue_id": issue_id,
      "content": [

      ]
    })
  } catch(err) {
    console.log("CONFLICT:", err);
    return null;
  }
}