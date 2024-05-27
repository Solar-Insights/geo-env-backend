import { GMAIL_EMAIL, GMAIL_PASSWORD } from "@/config";
import { createTransport } from "nodemailer";

function createEmailTransporter(service: string, user: string, password: string) {
    return createTransport({
        service: service,
        auth: {
          user: user,
          pass: password,
        },
    });
}

export async function sendNewOrganizationRequestEmail() {
    const SENDER_SERVICE = "gmail";
    const SUBJECT = "Bonjour";
    const CONTENT = "Bonjour";

    const NEW_ORGANIZATION_REQUEST_EMAIL_OPTIONS = {
        from: GMAIL_EMAIL,
        to: GMAIL_EMAIL,
        subject: SUBJECT,
        text: CONTENT
    }

    createEmailTransporter(SENDER_SERVICE, GMAIL_EMAIL, GMAIL_PASSWORD)
        .sendMail(NEW_ORGANIZATION_REQUEST_EMAIL_OPTIONS)
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
}
