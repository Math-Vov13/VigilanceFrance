import { z } from "zod";
import { UserDB, UserRegister } from "../schema/users_sc";
import { hashPassword, verifyPassword } from "../security/hash";

const fake_db: z.infer<typeof UserDB>[] = []



export async function getUserById(id: string): Promise<z.infer<typeof UserDB> | null> {
    const user = fake_db.find((user) => user.id === id);
    if (! user) {
        return null;
    }
    return user;
}

export async function getUser(email: z.infer<typeof UserRegister>["email"], password: z.infer<typeof UserRegister>["password"]) : Promise<z.infer<typeof UserDB> | null> {
    const user = fake_db.find((user) => user.email === email);
    if (! user) {
        return null;
    }

    // Verify password
    if (await verifyPassword(user.password, password)) {
        return user;
    }
    return null;
}

export async function getUser_byemail(email: string): Promise<z.infer<typeof UserDB> | null> {
    const user = fake_db.find((user) => user.email === email);
    return user || null;
}

export async function createUser(user: z.infer<typeof UserRegister>): Promise<z.infer<typeof UserDB> | null> {
    // Check if user already exists
    const existingUser = await getUser_byemail(user.email);
    if (existingUser) {
        return null;
    }

    const data = {
        "id": crypto.randomUUID(),
        "username": user.firstName + user.lastName,
        "password": await hashPassword(user.password),
        "email": user.email,
        "createdAt": new Date(),
    }
    fake_db.push(data);

    return data;
}