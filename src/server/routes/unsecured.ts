import express, { Request } from "express";
import { validateOrReject } from "class-validator";
import { EmailError, ObjectValidationError } from "@/server/utils/errors";
import { NewOrganizationFormClass } from "@/dto/unsecured/newOrganizationForm";
import { getAccessPathFromRequest } from "@/server/middlewares/postrequests";
import { sendNewOrganizationRequestEmail } from "@/server/services/emails";
import { validate } from "@/dto/validation/requestValidation";

function unsecuredRequestLogger(req: Request) {
    const accessPath = getAccessPathFromRequest(req);
    console.log(`\n--- UNSECURED REQUEST ---`);
    console.log(`ressource: ${accessPath}`);
}

const unsecuredRouter = express.Router();

unsecuredRouter.post("/unsecured/organization", async (req, res, next) => {
    unsecuredRequestLogger(req);

    const newOrganizationFormObject = new NewOrganizationFormClass(req.body);
    await validate(newOrganizationFormObject, "NewOrganizationFormClass", req);

    await sendNewOrganizationRequestEmail(newOrganizationFormObject)
        .then((logs: string) => {
            console.log(logs);

            res.status(201).json();
        })
        .catch((error) => {
            next(new EmailError(req.url, "SENDING"));
        });
});

export default unsecuredRouter;
