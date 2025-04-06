import { Request, Response, Router } from "express";

export const router = Router();

router.post("/register", (req: Request, res: Response) => {
    // Créer la Session
})

router.post("/login", (req: Request, res: Response) => {
    // Créer la Session
})

router.post("/logout", (req: Request, res: Response) => {
    // Détruit la Session
})