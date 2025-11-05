import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { User } from "@/app/models/User";
import { initDatabase } from "@/app/services/db";
import { generateToken } from "@/app/utils/jwt";

export async function POST(req:NextRequest) {
    try {
        //a
        const {email, password} = await req.json();

        if(!email || !password) {
            return NextResponse.json({error: "Enter email and password"}, {status: 400});
        }

        try {
            await initDatabase();
        } catch (dbError: any) {
            console.error('Database connection error:', dbError);
            return NextResponse.json(
                {error: "Database connection failed", details: dbError.message},
                {status: 500}
            );
        }

        const user = await User.findOne({where: {email}});

        if(!user) {
            return NextResponse.json({error: "Invalid email or password."}, {status: 401});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return NextResponse.json({error: "Invalid email or password."}, {status: 401});
        }
        
        const token = generateToken({id: user.id, email: user.email});

        return NextResponse.json({
            message: "Login successful!",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }, {status: 200});
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({
            error: "An unexpected error occurred",
            details: error.message
        }, {status: 500});
    }
}