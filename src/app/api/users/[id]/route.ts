import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/app/services/userService";
import { Context } from "vm";

export async function GET(req: NextRequest, context: {params: Promise<{id: string}>}){
    const { id } = await context.params;
    const user = await getUserById(Number(id))

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
}

export async function DELETE(req: NextRequest, context: {params: Promise<{id: string}>}){
    const { id } = await context.params;
    const success = await deleteUser(Number(id));
    
    return NextResponse.json(success ? {message: "User deleted successfully!"} : {error: "User not found."}, {status: success ? 200 : 404});
}

export async function PUT(req: NextRequest, context: {params: Promise<{id: string}>}){
    const { id} = await context.params;
    const data = await req.json();
    const user = await updateUser(Number(id), data);
    
    return NextResponse.json(user, {status: 200});
}
