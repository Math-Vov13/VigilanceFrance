import { Request, Response, Router } from "express";
import { verify_access_token } from "../middlewares/verify_aToken";
import { getUserById } from "../models/users_db";

export const router = Router();



router.get("/", (req: Request, res: Response) => {
    res.send("Account endpoint.");
})

/**
 * Show user Profile
 */
router.get("/profile", verify_access_token, async (req: Request, res: Response) => {
    const user = await getUserById(req.access_token_content as string);
    if (! user) {
        res.status(404).send("User not found");
        return;
    }
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }
    });
});