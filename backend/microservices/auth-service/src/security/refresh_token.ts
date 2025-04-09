import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.REFRESHTOKEN_SECRET_KEY || "refresh_token_secret_key";

export function generate_RefreshToken(data: string, web_agent: string): string {
    const token = jwt.sign({"dt": data}, SECRET_KEY, {
        issuer: web_agent,
        audience: "*",
        subject: "auth",
        expiresIn: "1d",
    });

    // Hash the token

    return token;
}

export function decode_RefreshToken(token: string, webagent: string): string | null {
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