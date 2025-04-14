import { Request, Response, Router } from "express";
import { generate_AccessToken } from "../security/access_token";
import { generate_RefreshToken } from "../security/refresh_token";
import { verify_access_token } from "../middlewares/verify_aToken";
import { verify_refresh_token } from "../middlewares/verify_rToken";
import { createUser, getUser } from "../models/users_db";
import { body_schema_validation } from "../middlewares/verify_schema";
import { UserLogin, UserRegister } from "../schema/users_sc";

export const router = Router();


async function createSession(res: Response, agent: string, userID: string, userName: string | null, refreshToken: string | null): Promise<Object> {
    const access_token = generate_AccessToken(userID, agent as string);

    // Create Cookie Access Token
    res.cookie("Atk", access_token, {
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    return {
        "connected": true,
        "user": userName,
        "_rft": refreshToken
        
    };
};


router.get("/", (req: Request, res: Response) => {
    res.send("Auth endpoint.");
})

/**
 * Refresh token
 * @description
 */
router.post("/refresh", verify_refresh_token, async (req: Request, res: Response) => {

    const agent = req.headers["user-agent"];
    if (agent === undefined) {
        res.status(400).send("User agent is undefined");
        return;
    }

    res.status(201).json(await createSession(res, agent as string, req.refresh_token_content as string, null, null));
})

/**
 * Créer un compte utilisateur
 */
router.post("/register", body_schema_validation(UserRegister), async (req: Request, res: Response) => {
    const agent = req.headers["user-agent"];
    if (agent === undefined) {
        res.status(400).send("User agent is undefined");
        return;
    }

    // Register user
    const user = await createUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
    });

    if (!user) {
        res.sendStatus(409);
        return;
    }

    // Return Tokens
    const refresh_token = generate_RefreshToken(user.id, agent as string);

    res.status(200).json(await createSession(res, agent as string, user.id, user.username, refresh_token));
})

/**
 * Connexion de l'utilisateur
 */
router.post("/login", body_schema_validation(UserLogin), async (req: Request, res: Response) => {
    // Créer la Session
    const agent = req.headers["user-agent"];
    if (agent === undefined) {
        res.status(400).send("User agent is undefined");
        return;
    }

    // Login user
    const user = await getUser(req.body.email, req.body.password);
    if (!user) {
        res.status(404).send("Invalid email or password");
        return;
    };

    // Return Tokens
    const refresh_token = generate_RefreshToken(user.id, agent as string);
    console.log("refresh", refresh_token);

    res.status(200).json(await createSession(res, agent as string, user.id, user.username, refresh_token));
})

/**
 *  Déconnexion de l'utilisateur
 */
router.post("/logout", verify_access_token, async (req: Request, res: Response) => {
    // Détruit la Session
    res.clearCookie("Atk");
    res.clearCookie("SID");

    res.sendStatus(204);
})