import { NextRequest, NextResponse } from "next/server";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '@/app/services/userService';

export async function GET(req: Request){
    try{
        const users = await getAllUsers();
        return NextResponse.json(users, {status: 200});
    } catch(error: any){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function POST(req: Request){
    try{
        const data = await req.json();
        const user = await createUser(data);
        return NextResponse.json(user, {status: 201});
    } catch(error: any){
        return NextResponse.json({error: error.message}, {status: 501});
    }
}