import { NextResponse } from "next/server";

import mongoose from "mongoose";

import { dbConnect } from "@/connections/dbConnect";
import { Users } from "@/models/userModel";

export async function GET(request: Request, { params }: { params: { _id: string } }) {

    try {

        const { _id } = params;

        if (!_id) {
            return NextResponse.json(
                { message: "Oops! Something went wrong. Please try again later." },
                { status: 400, statusText: "Bad Request" }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return NextResponse.json(
                {},
                { status: 400, statusText: "Bad Request" }
            );
        }

        await dbConnect()

        const user = await Users.findById(_id);
        if (!user) {
            return NextResponse.json(
                { message: "We couldn't find an account with that email. Please check your email or sign up." },
                { status: 401, statusText: "Unauthorized" }
            );
        }

        return NextResponse.json(
            { user },
            { status: 200, statusText: "OK" }
        );

    } catch (error) {

        return NextResponse.json(
            { message: "Oops! Something went wrong on our end. Please try again later.", error },
            { status: 500, statusText: "Internal Server Error" }
        );

    }

}