import { GMAIL_SENDER, GMAIL_SENDER_PASSWORD, EMAIL_RECEIVER } from "@/server/utils/env";
import { createTransport } from "nodemailer";
import { EmailOperationType } from "@/server/utils/types";
import { NewOrganizationFormClass } from "@/dto/unsecured/newOrganizationForm";
import { EmailError } from "@/server/utils/errors";

function createEmailTransporter(service: string, user: string, password: string) {
    return createTransport({
        service: service,
        auth: {
            user: user,
            pass: password
        }
    });
}

function emailLogger(sender: string, receiver: string, emailOperationType: EmailOperationType) {
    console.log(`sender: ${sender}`);
    console.log(`receiver: ${receiver}`);
    console.log(`**sucessfully ran email operation: ${emailOperationType}`);
}

export async function sendNewOrganizationRequestEmail(newOrganizationFormObject: NewOrganizationFormClass) {
    const SENDER_SERVICE = "gmail";
    const SUBJECT = `[${newOrganizationFormObject.pricingTier}] ${newOrganizationFormObject.modifiyingExistingPlan ? "Existing" : "New"} org. request from ${newOrganizationFormObject.name}`;
    const CONTENT = JSON.stringify(newOrganizationFormObject, null, 4);

    const NEW_ORGANIZATION_REQUEST_EMAIL_OPTIONS = {
        from: GMAIL_SENDER,
        to: EMAIL_RECEIVER,
        subject: SUBJECT,
        text: CONTENT
    };

    return createEmailTransporter(SENDER_SERVICE, GMAIL_SENDER, GMAIL_SENDER_PASSWORD)
        .sendMail(NEW_ORGANIZATION_REQUEST_EMAIL_OPTIONS)
        .then(() => {
            emailLogger(GMAIL_SENDER, EMAIL_RECEIVER, "SENDING");
        })
        .catch((error) => {
            throw new EmailError("SENDING");
        });
}
