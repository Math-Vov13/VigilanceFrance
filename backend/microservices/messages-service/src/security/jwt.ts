import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const ACCESSTOKEN_SECRET_KEY = process.env.ACCESSTOKEN_SECRET_KEY || 'access_token_secret_key';

export interface TokenPayload {
  userId: string;
  username: string;
  role?: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware pour vérifier le token JWT
 */
export const verifyToken: RequestHandler = (req, res, next) => {
  let token = req.cookies?.AuthToken;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Authentification requise' });
    return;
  }

  try {
    const decoded = jwt.verify(token, ACCESSTOKEN_SECRET_KEY) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token invalide ou expiré' });
  }
};

// /**
//  * Génère un token JWT
//  */
// export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
//   return jwt.sign(payload, ACCESSTOKEN_SECRET_KEY, { expiresIn: '24h' });
// }