import nodemailer from "nodemailer"

const USER = process.env.USER || "voltantroyer2@gmail.com"
const PASS = process.env.PASS || "gwyh arfz squh sdlq"

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: USER,
        pass: PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});