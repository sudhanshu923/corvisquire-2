import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { dbConnect } from "@/connections/dbConnect";
import { Users } from "@/models/userModel";
import { sendMail } from "@/utils/transporters/sendMail";

const DOMAIN = process.env.DOMAIN || "http://localhost:3000";

export async function POST(request: Request) {

    try {

        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "Oops! It looks like you're missing some information. Please provide your username, email, and password." },
                { status: 400, statusText: "Bad Request" }
            );
        }

        await dbConnect();

        const existingUserByUsername = await Users.findOne({ username });
        const existingUserByEmail = await Users.findOne({ email });

        if (existingUserByUsername || existingUserByEmail) {
            return NextResponse.json(
                { message: "It looks like an account with this username or email already exists. Please try again with a different one." },
                { status: 400, statusText: "Bad Request" }
            );
        }

        const salt = await bcrypt.genSalt(11);
        const hashedPassword = await bcrypt.hash(password, salt);
        if (!hashedPassword) {
            return NextResponse.json(
                { message: "Oops! There was an issue securing your password. Please try again." },
                { status: 500, statusText: "Internal Server Error" }
            );
        }

        const user = await Users.create({ username, email: email.toLowerCase(), password: hashedPassword });
        if (!user) {
            return NextResponse.json(
                { message: "Something went wrong while registering your account. Please try again later." },
                { status: 500, statusText: "Internal Server Error" }
            );
        }

        const confirmationUrl = `${DOMAIN}/api/auth/register/confirm/${user._id}`;

        const mailOptions = {
            to: email,
            from: {
                name: 'Persephone Stephenson from Thwackey',
                email: 'persephonestephenson@gmail.com'
            },
            subject: 'Complete Your Registration',
            text: `Hi ${username},\n\nPlease click the following link to confirm your account:\n\n${confirmationUrl}`,
            html: `<p>Hi ${username},</p><p>Please click the following link to confirm your account:</p><p><a href="${confirmationUrl}">Confirm Account</a></p>`,
        }

        await sendMail(mailOptions);

        return NextResponse.json(
            { message: `You're almost there, ${username}! 🎉 To complete your registration, please check your email and click the link we just sent you to confirm your account.`, userId: user._id },
            { status: 200, statusText: "Created" }
        );

    } catch (error) {

        return NextResponse.json(
            { message: "Oops! Something went wrong on our end. Please try again later.", error },
            { status: 500, statusText: "Internal Server Error" }
        );

    }

}