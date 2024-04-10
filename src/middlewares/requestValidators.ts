import { InvalidParameterError } from "@/middlewares/customErrors";
import { RequestHandler } from "express";
import { claimIncludes } from "express-oauth2-jwt-bearer";
import { Coordinates, validCoordinates } from "geo-env-typing/geo";

export const authRequiredPermissions = (permission: string | string[]) => {
    if (typeof permission === 'string') {
      permission = [permission]
    }
    return claimIncludes('permissions', ...permission)
  }

export const validateRequestCoordinates: RequestHandler = (req, res, next) => {
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng)
    };

    if (!validCoordinates(coord)) {
        next (
            new InvalidParameterError(
                req.url, 
                "Coordinates should respect a certain range, and be numbers. Longitudes range between -180 and 180, and latitudes range between -90 and 90."
            )
        );
    }
    
    next();
};