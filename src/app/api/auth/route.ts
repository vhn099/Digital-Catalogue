import { decrypt, encrypt } from "@/lib/lib";
import { NextRequest, NextResponse } from "next/server";

const login = async (user: any) => {
    // Create the session
    const expires = 3600;
    const session = await encrypt({ user, expires });

    return new Response('COOKIE GENERATED', {
        status: 200,
        headers: { 'Set-Cookie': `${process.env.AUTH_COOKIE_NAME}=${session}; Max-Age=${expires}; HttpOnly=true` }
    });
};

const logout = () => {
    return new Response('COOKIE DELETED', {
        status: 200,
        headers: { 'Set-Cookie': `${process.env.AUTH_COOKIE_NAME}=deleted; Max-Age=0` }
    });
}

const getSession = async (request: NextRequest) => {
    if (request.cookies.get(process.env.AUTH_COOKIE_NAME)) {
        const session = request.cookies.get(process.env.AUTH_COOKIE_NAME).value;
        return await decrypt(session);
    }
    return null;
}

export async function GET(request: NextRequest, context: any) {
    const params = request.nextUrl.searchParams;
    const type = params.get('type');
    let data = {}
    switch (type) {
        case 'getSession':
            data = await getSession(request);
            break;
    }
    return NextResponse.json({
        data
    });
}

export async function POST(request: NextRequest, context: any) {
    const responseData = {
        message: '',
        status: 'success',
        code: 200,
        data: {}
    };
    try {

        const body = await request.json();
        switch (body.type) {
            case 'login':
                const user = body.user;
                const result = await login(user);
                return result;
            case 'logout':
                const resultLogout =  logout();
                return resultLogout;
        }
    } catch (error: any) {
        responseData.message = error.message;
        responseData.code = 404;
        responseData.status = "Failed"
    }

    return NextResponse.json(responseData);
}