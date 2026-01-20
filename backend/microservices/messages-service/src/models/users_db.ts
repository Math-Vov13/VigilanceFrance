import { IUser, UsersModel } from "../schemas/mongo_users_sc";



export async function getUserById(id: string): Promise<IUser | null> {
    try {
        const user = await UsersModel.findById(id).exec();
        console.log("User:", user);

        return user;

    } catch (err) {
        console.log("NOT FOUND:", err);
        return null;
    }
}