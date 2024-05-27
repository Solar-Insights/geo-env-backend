import { GMAIL_EMAIL, GMAIL_PASSWORD } from "@/config";
import { createTransport } from "nodemailer";
import { EmailOperationType } from "@/services/types";
import { NewOrganizationFormClass } from "@/dto/unsecured/newOrganizationForm";

function createEmailTransporter(service: string, user: string, password: string) {
    return createTransport({
        service: service,
        auth: {
          user: user,
          pass: password,
        },
    });
}

function emailLogger(sender: string, receiver: string, emailOperationType: EmailOperationType) {
    return `sender: ${sender}\nreceiver: ${receiver}\n**sucessfully ran email operation: ${emailOperationType}`;
}

export async function sendNewOrganizationRequestEmail(newOrganizationFormObject: NewOrganizationFormClass) {
    const SENDER_SERVICE = "gmail";
    const SUBJECT = `New org. request from ${newOrganizationFormObject.name} - ${newOrganizationFormObject.pricingTier}`;
    const CONTENT = JSON.stringify(newOrganizationFormObject, null, 4);

    const NEW_ORGANIZATION_REQUEST_EMAIL_OPTIONS = {
        from: GMAIL_EMAIL,
        to: GMAIL_EMAIL,
        subject: SUBJECT,
        text: CONTENT
    }

    return createEmailTransporter(SENDER_SERVICE, GMAIL_EMAIL, GMAIL_PASSWORD)
        .sendMail(NEW_ORGANIZATION_REQUEST_EMAIL_OPTIONS)
        .then(() => {
            return emailLogger(GMAIL_EMAIL, GMAIL_EMAIL, "SENDING");
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
}
