import {NextRequest, NextResponse} from "next/server";


export default async function middleware(request: NextRequest){
    const isAuthenticated = request.cookies.has('privy-token');

    if(!isAuthenticated && request.nextUrl.pathname.startsWith('/me')){
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}
