import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.ACCESSTOKEN_SECRET_KEY || "access_token_secret_key";

export function decode_AccessToken(token: string, webagent: string): string | null {
    try {

        const decryptedToken = token;
        const decodedToken = jwt.verify(decryptedToken, SECRET_KEY) as JwtPayload;

        if (decodedToken.iss !== webagent) {
            console.error("Invalid token issuer!");
            return null;
        }

        if (decodedToken.sub !== "auth") {
            console.error("Invalid token subject!");
            return null;
        }

        console.log("Decoded token:", decodedToken);
        return decodedToken.dt;
    } catch (err) {
        console.error("Error decoding token:", err);
        return null;
    }
}