import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { User } from "@/app/models/User";
import sequelize from "@/app/services/sequelize";
import { generateToken } from "@/app/utils/jwt";

export async function POST(req:NextRequest) {
    try {
        const {email, password} = await req.json();

        if(!email || !password)
            return NextResponse.json({error: "Enter email and password"});

        await sequelize.authenticate();
        User.initModel(sequelize);

        const user = await User.findOne({where: {email}});

        if(!user)
            return NextResponse.json({error: "Invalid email or password."}, {status: 401});

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid)
            return NextResponse.json({error: "Invalid email or password."}, {status: 401});
        
        const token = generateToken({id: user.id, email: user.email})

        return NextResponse.json({message: "Login successful!", token, user}, {status: 200});
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 501});
    }
}