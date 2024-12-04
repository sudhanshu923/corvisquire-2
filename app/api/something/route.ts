import { NextResponse } from "next/server";

import jwt, { JwtPayload } from "jsonwebtoken";

import { dbConnect } from "@/connections/dbConnect";
import { Users } from "@/models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "GGfUN0CI54ggLtl67xQaBhJMEHcjRRrjrhK4fRjpwnI";

export function verifyToken(token: string): JwtPayload | NextResponse {

    try {

        return jwt.verify(token, JWT_SECRET) as JwtPayload;

    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            return NextResponse.json(
                { message: "Your session has expired. Please log in again to continue." },
                { status: 401,statusText:"Unauthorized"}
            );
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { message: "Invalid authentication token. Please log in again." },
                { status: 401,statusText:"Unauthorized" }
            );
        }

        return NextResponse.json(
            { message: "Something went wrong on our end. Please try again later." },
            { status: 500, statusText: "Internal Server Error" }
        );

    }

}

export async function POST(request: Request) {

    try {

        const authorizationHeader = request.headers.get("Authorization");
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: "You need to be logged in to access this resource." },
                { status: 401,statusText:"Unauthorized" }
            );
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            return NextResponse.json(
                { message: "Authentication token is missing. Please log in again." },
                { status: 401,statusText:"Unauthorized" }
            );
        }

        const decoded = verifyToken(token);
        if (decoded instanceof NextResponse) { return decoded }

        if (!decoded.userId) {
            return NextResponse.json(
                { message: "Something went wrong. Please try again later." },
                { status: 401,statusText:"Unauthorized" }
            );
        }

        await dbConnect()

        const user = await Users.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { message: "We couldn't find an account with your information. Please check your details or sign up." },
                { status: 401, statusText: "Unauthorized" }
            );
        }

        const userDetails = {
            userId: user._id || "",
            username: user.username || "",
            email: user.email || "",
            avatar: user.avatar || "https://ui.shadcn.com/avatars/shadcn.jpg"
        };

        return NextResponse.json(
            { message: `Welcome back, ${userDetails.username}! We're happy to see you again.`, userDetails },
            { status: 200,statusText:"OK" }
        );

    } catch (error) {

        return NextResponse.json(
            { message: "Something went wrong on our end. Please try again later." },
            { status: 500, statusText: "Internal Server Error" }
        );

    }

}
