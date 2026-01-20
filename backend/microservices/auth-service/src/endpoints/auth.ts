import { Request, Response, Router } from "express";
import { generate_AccessToken } from "../security/access_token";
import { verify_access_token } from "../middlewares/verify_aToken";
import { verify_refresh_token } from "../middlewares/verify_rToken";
import { createUser, getUser, getUserById, getUserByEmail } from "../models/users_db";
import { body_schema_validation } from "../middlewares/verify_schema";
import { UserLogin, UserRegister } from "../schema/users_sc";
import { cacheToken, deleteCacheToken } from "../models/refresh_cache";
import { redisClient } from "../models/redis-connector";
import axios from "axios";

export const router = Router();

const WELCOME_CHANNEL = "new_user";
const NEW_CONNECION_CHANNEL = "new_connection_to_account";


function createAccessCookie(res: Response, data_to_store: string, agent: string): string {
    const access_token = generate_AccessToken(data_to_store, agent as string);

    // Create Cookie Access Token
    res.cookie("Atk", access_token, {
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
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
        profileImage: req.body?.profileImage,
        authProvider: req.body?.authProvider,
        email: req.body.email,
    });

    if (!user) {
        res.sendStatus(409);
        return;
    }

    // PUB EVENT (new user)
    await redisClient.publish(WELCOME_CHANNEL, JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: req.ip,
        created_at: user.created_at,
    }));

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

    // PUB EVENT (new connection to account!)
    await redisClient.publish(NEW_CONNECION_CHANNEL, JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: req.ip,
        created_at: user.created_at,
    }));

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
    res.clearCookie("SID");
    try {
        await deleteCacheToken(req.refresh_token as string);
    } catch {

    };
    req.session.destroy((err) => {});

    res.sendStatus(204);
})

/**
 * Google OAuth Authentication
 */
router.post("/google", async (req: Request, res: Response) => {
  const { code } = req.body;
  const agent = req.headers["user-agent"];
  
  if (!agent) {
    res.status(400).send("User agent is undefined");
    return;
  }
  
  if (!code) {
    res.status(400).send("Authorization code is required");
    return;
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback',
      grant_type: 'authorization_code'
    });

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { email, given_name, family_name, picture } = userInfoResponse.data;

    // Find or create user in your database
    let user = await getUserByEmail(email);
    let created = false;
    
    if (!user) {
      user = await createUser({
        email,
        firstName: given_name || 'Google',
        lastName: family_name || 'User',
        password: "",
        profileImage: picture,
        authProvider: 'google'
      });
      created = true;
    }
    
    if (!user) {
      res.status(500).send("Failed to create user");
      return;
    }
    
    // Publish appropriate event based on whether user was created or logged in
    if (created) {
      await redisClient.publish("new_user", JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: req.ip,
        created_at: user.created_at,
      }));
    } else {
      await redisClient.publish("new_connection_to_account", JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: req.ip,
        created_at: user.created_at,
      }));
    }
    req.session.connected = true;
    req.session.lastName = user.lastName;
    req.session.firstName = user.firstName;
    req.session.save((err) => {
      req.session.resetMaxAge();
    });

    const accessToken = createAccessCookie(res, user.id, agent);
    const refreshToken = await cacheToken(user.id, accessToken);

    // Return response matching your login/register format
    res.status(200).json({
      success: true,
      created,
      message: created ? "Account created successfully" : "Login successful",
      data: {
        user: {
          _id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImage: user.profileImage
        },
        refreshToken
      }
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).send("Authentication failed");
    return;
  }
});

/**
 * GitHub OAuth Authentication
 */
router.post("/github", async (req: Request, res: Response) => {
  const { code } = req.body;
  const agent = req.headers["user-agent"];
  
  if (!agent) {
    res.status(400).send("User agent is undefined");
    return;
  }
  
  if (!code) {
    res.status(400).send("Authorization code is required");
    return;
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID || 'Ov23linJH8LNaDmzTycN',
        client_secret: process.env.GITHUB_CLIENT_SECRET || '4d994495ab5efdf77e03639c10119e25fed79b3d',
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/callback'
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      res.status(400).send("No access token received from GitHub");
      return;
    }

    // Get user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { 
        Authorization: `Bearer ${access_token}`,
        'User-Agent': 'YourAppName'
      }
    });

    // Get user emails
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { 
        Authorization: `Bearer ${access_token}`,
        'User-Agent': 'YourAppName'
      }
    });

    const emails = emailResponse.data;
    const primaryEmail = emails.find((e: any) => e.primary && e.verified)?.email;

    if (!primaryEmail) {
      res.status(400).send("No verified email found in GitHub account");
      return;
    }

    const { name, avatar_url, login } = userResponse.data;

    // Split name or use login as fallback
    const fullName = name || login;
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || login;
    const lastName = nameParts.slice(1).join(' ') || '';


    let user = await getUserByEmail(primaryEmail);
    let created = false;
    
    if (!user) {
      user = await createUser({
        email: primaryEmail,
        firstName,
        lastName,
        password: "",
        profileImage: avatar_url,
        authProvider: 'github'
      });
      created = true;
    }
    
    if (!user) {
      res.status(500).send("Failed to create user");
      return;
    }
    
    // Publish appropriate event
    if (created) {
      await redisClient.publish("new_user", JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: req.ip,
        created_at: user.created_at,
      }));
    } else {
      await redisClient.publish("new_connection_to_account", JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: req.ip,
        created_at: user.created_at,
      }));
    }

    // Create session
    req.session.connected = true;
    req.session.lastName = user.lastName;
    req.session.firstName = user.firstName;
    req.session.save((err) => {
      req.session.resetMaxAge();
    });

    // Generate tokens
    const accessToken = createAccessCookie(res, user.id, agent);
    const refreshToken = await cacheToken(user.id, accessToken);

    res.status(200).json({
      success: true,
      created,
      message: created ? "Account created successfully" : "Login successful",
      data: {
        user: {
          _id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImage: user.profileImage
        },
        refreshToken
      }
    });

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).send("Authentication failed");
    return;
  }
});