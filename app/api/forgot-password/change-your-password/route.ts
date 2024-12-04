import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { NextResponse } from "next/server";

import { dbConnect } from "@/connections/dbConnect";
import { Users } from "@/models/userModel";
import { sendMail } from "@/utils/transporters/sendMail";

export async function PUT(request: Request) {

    try {

        const { password, _id } = await request.json();

        if (!password || !_id) {
            return NextResponse.json(
                { message: "Oops! Something went wrong. Please try again later." },
                { status: 400, statusText: "Bad Request" }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return NextResponse.json(
                { message: "Oops! The provided user ID is invalid." },
                { status: 400, statusText: "Bad Request" }
            );
        }

        await dbConnect();

        const user = await Users.findById(_id);
        if (!user) {
            return NextResponse.json(
                { message: "We couldn't find an account with that ID. Please make sure you're registered." },
                { status: 404, statusText: "Not Found" }
            );
        }

        if (user.resettingExpiresIn < Date.now()) {
            return NextResponse.json(
                { message: "Your password reset link has expired. Please request a new one." },
                { status: 410, statusText: "Gone" }
            );
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            return NextResponse.json(
                { message: "Oops! The new password can't be the same as the current one. Please choose a different password." },
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

        user.password = hashedPassword;
        user.resetPasswordCounter = user.resetPasswordCounter + 1;
        user.resettingExpiresIn = null;
        await user.save();

        await sendMail({
            to: user.email,
            from: {
                name: 'Persephone Stephenson from Thwackey',
                email: 'persephonestephenson@gmail.com'
            },
            subject: "Your Password Has Been Successfully Changed",
            html: `
                <h1>Congratulations!</h1>
                <p>You have successfully changed your password at ${new Date().toLocaleString()}.</p>
            `
        })

        return NextResponse.json(
            { message: "Your password has been successfully updated." },
            { status: 200, statusText: "OK" }
        );

    } catch (error) {

        return NextResponse.json(
            { message: "Oops! Something went wrong on our end. Please try again later.", error },
            { status: 500, statusText: "Internal Server Error" }
        );

    }

}
