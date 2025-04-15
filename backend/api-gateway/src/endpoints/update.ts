import express from "express";
import { Request, Response, Router } from "express";
import { body_schema_validation } from "../middlewares/verify_schema";
import { schema_pos } from "../schemas/updates_sc";
import z from "zod";

export const router = Router();




function calcul_km(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const LONGITUDE_TO_KM = 111.11;
    const LATITUDE_TO_KM = 80; // En France ! (https://openclassrooms.com/forum/sujet/convertir-des-latitudes-longitude-en-km)

    const lng_r1 = (LONGITUDE_TO_KM * lng1) * Math.cos(LATITUDE_TO_KM * lat1);
    const lng_r2 = (LONGITUDE_TO_KM * lng2) * Math.cos(LATITUDE_TO_KM * lat2);

    return Math.abs(lng2 - lng1);
}


router.post("/pos", express.json(), body_schema_validation(schema_pos), (req: Request<any, any, z.infer<typeof schema_pos>>, res: Response) => {
    const actualDate: Date = new Date()
    if (!req.session.last_pos_updated) {
        req.session.last_pos_updated = actualDate.toUTCString();
        req.session.last_lat = req.body.lat;
        req.session.last_lng = req.body.lng;

    } else {
        const MAX_KM_PER_MINUTES = 10;

        const distance = calcul_km(req.session.last_lat as number, req.session.last_lng as number, req.body.lat, req.body.lng);
        const time_passed = actualDate.getMilliseconds() - new Date(req.session.last_pos_updated as string).getMilliseconds(); // milliseconds

        // A dépassé la distance max
        if ((distance * (time_passed)/1000) > MAX_KM_PER_MINUTES ) {
            console.log("TRICHEUR !");
            res.sendStatus(409);
            return;
        };
    
        req.session.last_pos_updated = actualDate.toUTCString();
        req.session.last_lat = req.body.lat;
        req.session.last_lng = req.body.lng;
    
        req.session.save((err) => {
            if (err) {
                console.error("Error during Session save:", err);
                req.session.regenerate((err) => { });
                return;
            }
            req.session.resetMaxAge();
        })
    }

    res.sendStatus(200);
})