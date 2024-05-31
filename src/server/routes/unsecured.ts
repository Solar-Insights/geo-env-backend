import express, { Request } from "express";
import { EmailError } from "@/server/utils/errors";
import { NewOrganizationFormClass } from "@/dto/unsecured/newOrganizationForm";
import { getAccessPathFromRequest } from "@/server/utils/helpers";
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
    await validate(newOrganizationFormObject, "NewOrganizationFormClass");

    await sendNewOrganizationRequestEmail(newOrganizationFormObject)

    res.status(201).json();
});

export default unsecuredRouter;
