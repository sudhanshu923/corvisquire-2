import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { dbConnect } from "@/connections/dbConnect";
import { Users } from "@/models/userModel";

const JWT_SECRET = process.env.JWT_SECRET as string

export async function POST(request: Request) {

    try {

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Please provide both your email and password to continue." },
                { status: 400, statusText: "Bad Request" }
            );
        }

        await dbConnect();

        const user = await Users.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { message: "We couldn't find an account with that email. Please check your email or sign up." },
                { status: 401, statusText: "Unauthorized" }
            );
        }

        if (!user.verified) {
            return NextResponse.json(
                { message: "Your account isn't verified yet. Please check your email for the verification link." },
                { status: 403, statusText: "Forbidden" }
            );
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json(
                { message: "Oops! That password doesn't seem to match. Please try again." },
                { status: 401, statusText: "Unauthorized" }
            );
        }

        const Quark = jwt.sign({

            userId: user._id,

        }, JWT_SECRET, {

            algorithm: "HS512",
            expiresIn: "5d"

        });

        return NextResponse.json(
            { message: `Welcome back, ${user.username}! We're so glad to see you again. Let's get started!`, Quark },
            { status: 200, statusText: "OK" },
        );

    } catch (error) {

        return NextResponse.json(
            { message: "Oops! Something went wrong on our end. Please try again later.", error },
            { status: 500, statusText: "Internal Server Error" }
        );

    }

}
