import sgMail from "@sendgrid/mail"

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "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"

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendMail = async (msg: sgMail.MailDataRequired) => {

    try {

        await sgMail.sendMultiple(msg);

    } catch (error) { throw new Error() }

}