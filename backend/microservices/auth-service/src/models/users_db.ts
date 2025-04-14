import { z } from "zod";
import { UserRegister } from "../schema/users_sc";
import { hashPassword, verifyPassword } from "../security/hash";
import { IUser, UsersModel } from "../schema/mongo_users_sc";

// const fake_db: z.infer<typeof UserDB>[] = []



export async function getUserById(id: string): Promise<IUser | null> {
    // const user = fake_db.find((user) => user.id === id);
    // if (! user) {
    //     return null;
    // }
    // return user;

    try {
        const user = await UsersModel.findById(id).exec();
        console.log("User:", user);

        return user;

    } catch (err) {
        console.log("NOT FOUND:", err);
        return null;
    }
}

export async function getUser(email: z.infer<typeof UserRegister>["email"], password: z.infer<typeof UserRegister>["password"]) : Promise<IUser | null> {
    // const user = fake_db.find((user) => user.email === email);
    // if (! user) {
    //     return null;
    // }

    // // Verify password
    // if (await verifyPassword(user.password, password)) {
    //     return user;
    // }

    try {
        // Find User
        const user = await UsersModel.findOne({ email: email }).exec();
        console.log("User:", user);

        // Match Password
        if (await verifyPassword(user?.password as string, password)) {
            return user;
        }

    } catch (err) {
        console.log("NOT FOUND:", err);
        return null;
    }

    return null;
}

// export async function getUser_byemail(email: string): Promise<z.infer<typeof UserDB> | null> {
//     const user = fake_db.find((user) => user.email === email);
//     return user || null;
// }

export async function createUser(user: z.infer<typeof UserRegister>): Promise<IUser | null> {
    // // Check if user already exists
    // const existingUser = await getUser_byemail(user.email);
    // if (existingUser) {
    //     return null;
    // }
    // const data = {
    //     "id": crypto.randomUUID(),
    //     "username": user.firstName + user.lastName,
    //     "password": await hashPassword(user.password),
    //     "email": user.email,
    //     "createdAt": new Date(),
    // }
    // fake_db.push(data);

    try {
        const new_user = await UsersModel.create({
            "lastName": user.lastName,
            "firstName": user.firstName,
            "email": user.email,
            "password": await hashPassword(user.password)
        });
        console.log("User:", new_user);
        return new_user

    } catch (err) {
        console.log("CONFLICT:", err);
        return null;
    }
}