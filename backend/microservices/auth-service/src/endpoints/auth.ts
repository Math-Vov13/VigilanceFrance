import { Request, Response, Router } from "express";
import { generate_AccessToken } from "../security/access_token";
import { verify_access_token } from "../middlewares/verify_aToken";
import { verify_refresh_token } from "../middlewares/verify_rToken";
import { createUser, getUser, getUserById } from "../models/users_db";
import { body_schema_validation } from "../middlewares/verify_schema";
import { UserLogin, UserRegister } from "../schema/users_sc";
import { cacheToken, deleteCacheToken } from "../models/refresh_cache";

export const router = Router();



function createAccessCookie(res: Response, data_to_store: string, agent: string): string {
    const access_token = generate_AccessToken(data_to_store, agent as string);

    // Create Cookie Access Token
    res.cookie("Atk", access_token, {
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return access_token;
}


router.get("/", (_: Request, res: Response) => {
    res.send("Auth endpoint.");
})

/**
 * Refresh token
 * @description Renouvelle le token d'authentification de l'utilisateur
 */
router.post("/refresh", verify_refresh_token, async (req: Request, res: Response) => {
    // Devrait utiliser le Access_Token: mais par manque de temps et surtout un problème de logique (comment gérer le multiplateforme si on peut créer seulement un refresh token par compte ??)

    // Renouvelle le token d'authentification de l'utilisateur à partir du token refresh
    const agent = req.headers["user-agent"];
    if (agent === undefined) {
        res.status(400).send("User agent is undefined");
        return;
    }

    const user = await getUserById(req.refresh_token_content?.id as string);
    if (! user) {
        res.status(401).send("Invalid Refresh Token!");
        return;
    }

    req.session.resetMaxAge();

    const access_token = createAccessCookie(res, user.id, agent as string);
    res.status(200).json({
        "created": false,
        "user": user.id,
        "email": user.email
    })

    // res.status(200).json(await createSession(res, agent as string, req.refresh_token_content as string, null, null));
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

    req.session.connected = true;
    req.session.lastName = user.lastName;
    req.session.firstName = user.firstName;
    req.session.save((err) => {
        req.session.resetMaxAge();
    });

    // Return Tokens
    const access_token = createAccessCookie(res, user.id, agent as string);
    const refresh_token = await cacheToken(user.id, access_token);

    res.status(200).json({
        "created": true,
        "user": user.id,
        "email": user.email,
        "_rft": refresh_token,
    })
    // res.status(200).json(await createSession(res, agent as string, user.id, user.username, refresh_token));
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

    req.session.connected = true;
    req.session.lastName = user.lastName;
    req.session.firstName = user.firstName;
    req.session.save((err) => {
        req.session.resetMaxAge();
    });

    // Return Tokens
    const access_token = createAccessCookie(res, user.id, agent as string);
    const refresh_token = await cacheToken(user.id, access_token);

    res.status(200).json({
        "created": false,
        "user": user.id,
        "email": user.email,
        "_rft": refresh_token,
    })

    // res.status(200).json(await createSession(res, agent as string, user.id, user.username, refresh_token));
})

/**
 *  Déconnexion de l'utilisateur
 */
router.post("/logout", verify_access_token, verify_refresh_token, async (req: Request, res: Response) => {
    // Détruit la Session
    res.clearCookie("Atk");
    try {
        await deleteCacheToken(req.refresh_token as string);
    } catch {

    };
    req.session.destroy((err) => {});

    res.sendStatus(204);
})