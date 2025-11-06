import { NextResponse } from "next/server";
import { createUser, getAllUsers} from '@/app/services/userService';

export async function GET(req: Request){
    try{
        const users = await getAllUsers();
        return NextResponse.json(users, {status: 200});
    
    } catch(error: any){
        console.error("Error fetching users", error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function POST(req: Request){
    try{
        const data = await req.json();
        const user = await createUser(data);
        
        const {password, ...safeUser} = user.get({plain: true});
        return NextResponse.json(safeUser, {status: 201});
    } catch(error: any){
        return NextResponse.json({error: error.message}, {status: 501});
    }
}