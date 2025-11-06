import { NextResponse } from "next/server";
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY);

export async function POST(req: Request){
    try {
        const {email} = await req.json();

        if(!email){
            return NextResponse.json({error: "Email is required."}, {status: 400})
        }

        const invitation = await workos.userManagement.sendInvitation({ email }); 

        return NextResponse.json({message: "Invitation sent successfully!", invitation});
    } catch (error: any) {
        console.error("Error sending invitation.", error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
