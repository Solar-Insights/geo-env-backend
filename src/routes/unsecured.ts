import express from "express";
import { getGeocoding } from "@/api/geo";
import { ApiError } from "@/middlewares/customErrors";
import { NewOrganizationForm } from "@/services/types";
import { validateOrReject } from "class-validator";
import { ObjectValidationError } from "@/middlewares/customErrors";
import { NewOrganizationFormClass } from "@/dto/unsecured/newOrganizationForm";

const unsecuredRouter = express.Router();

unsecuredRouter.post("/unsecured/organization", async (req, res, next) => {
    const newOrganizationFormObject = new NewOrganizationFormClass(req.body);

    await validateOrReject(newOrganizationFormObject)
        .catch((errors) => {
            console.log(errors);
            next(new ObjectValidationError(
                req.url,
                "NewOrganizationFormClass"
            ));
        });

    
});

export default unsecuredRouter;
