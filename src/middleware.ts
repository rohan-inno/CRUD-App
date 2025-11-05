import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "./app/utils/jwt";

export function middleware(req: NextRequest){
    const {pathname} = req.nextUrl;

    if(pathname.startsWith("/api/users")){
        const authHeader = req.headers.get("authorization");

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const token = authHeader.split(" ")[1];
        try {
            const decoded = verifyToken(token);
            if (!decoded) throw new Error("Invalid token");

            return NextResponse.next();
            } catch (err) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
            }
        }

    return NextResponse.next();
}


export const config = {
    matcher: ["/api/users/:path*"],
    runtime: "nodejs"
};