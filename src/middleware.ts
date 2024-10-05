import { NextRequest, NextResponse } from 'next/server'
// import { checkUserLoggedIn } from '@/firebase/auth';
import { authMiddleware } from 'next-firebase-auth-edge';

const authPaths = ['/login'];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // const pathName = request.url;
    // const user = await checkUserLoggedIn();
    // const authCheck = authPaths.some((path) => pathName.startsWith(path)); // Check if users access to log in page.
    // if (authCheck && user) { // Check if user access to login page if they are already logged in.
    //     return NextResponse.redirect(new URL('/home', request.url))
    // }
    return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};