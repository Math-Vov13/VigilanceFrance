import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const body_schema_validation = (schema: z.AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    
    try {
        req.body = await schema.parseAsync(data) || {}
        next();
    } catch (error) {
        console.error(error)
        res.sendStatus(422);
    }
}