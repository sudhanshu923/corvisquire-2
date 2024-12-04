import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "voltantroyer2@gmail.com",
        pass: "gwyh arfz squh sdlq"
    },
    tls: {
        rejectUnauthorized: false
    }
});