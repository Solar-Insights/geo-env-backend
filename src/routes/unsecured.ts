import express from "express";
import { validateOrReject } from "class-validator";
import { ObjectValidationError } from "@/middlewares/customErrors";
import { NewOrganizationFormClass } from "@/dto/unsecured/newOrganizationForm";

const unsecuredRouter = express.Router();

unsecuredRouter.post("/unsecured/organization", async (req, res, next) => {
    const newOrganizationFormObject = new NewOrganizationFormClass(req.body);

    await validateOrReject(newOrganizationFormObject)
        .catch((errors) => {
            next(new ObjectValidationError(
                req.url,
                "NewOrganizationFormClass"
            ));
        });
    
    // Send email to someone with info
    res.status(201).json();
});

export default unsecuredRouter;
