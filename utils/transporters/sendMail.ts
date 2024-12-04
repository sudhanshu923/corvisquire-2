import sgMail from "@sendgrid/mail"

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendMail = async (msg: sgMail.MailDataRequired) => {

    try {

        await sgMail.sendMultiple(msg);

    } catch (error) { throw new Error() }

}