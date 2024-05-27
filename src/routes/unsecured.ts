import express, { Request } from "express";
import { validateOrReject } from "class-validator";
import { EmailError, ObjectValidationError } from "@/middlewares/customErrors";
import { NewOrganizationFormClass } from "@/dto/unsecured/newOrganizationForm";
import { getAccessPathFromRequest } from "@/middlewares/responseHandlers";
import { sendNewOrganizationRequestEmail } from "@/services/emails";

const unsecuredRouter = express.Router();

function unsecuredRequestLogger(req: Request) {
    const accessPath = getAccessPathFromRequest(req);
    console.log(`\n--- UNSECURED REQUEST ---`);
    console.log(`ressource: ${accessPath}`);
}

unsecuredRouter.post("/unsecured/organization", async (req, res, next) => {
    const newOrganizationFormObject = new NewOrganizationFormClass(req.body);

    await validateOrReject(newOrganizationFormObject)
        .catch((errors) => {
            next(new ObjectValidationError(
                req.url,
                "NewOrganizationFormClass"
            ));
        });
    
    await sendNewOrganizationRequestEmail(req.body)
        .then(() => {
            unsecuredRequestLogger(req);
            res.status(201).json();
        })
        .catch((error) => {
            next(new EmailError(
                req.url,
                "SENDING"
            ));
        });
});

export default unsecuredRouter;
