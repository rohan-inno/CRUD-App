import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcryptjs';
import { User } from "@/app/models/User";
import sequelize from "@/app/services/sequelize";
import { generateToken } from "@/app/utils/jwt";

export async function POST(req:NextRequest) {
    try {
        const {name, phone, email, address, password} = await req.json();

        if(!name || !phone || !email || !address || !password)
            return NextResponse.json({error: "Missing required fields"})

        await sequelize.authenticate();
        User.initModel(sequelize);

        const existingUser = await User.findOne({where: {email}});
        if(existingUser)
            return NextResponse.json({error: "User already exists."})

        const hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name, phone, email, address, password: hash
        });

        const token = generateToken({id: newUser.id, email: newUser.email});

        return NextResponse.json({message: "User registered successfully!", user: newUser, token}, {status: 201})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 501})
    }
}