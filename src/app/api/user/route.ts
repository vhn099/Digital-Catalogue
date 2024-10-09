import { upsertUser } from "@/firebase/firestore/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

const collectionName = "users";

/* 
    API STATUS CODE:
    - 400: Bad request => server doesn't understand syntax comes from client
    - 401: Unauthorized =>  Client needs to be indentified first then call the server
    - 402: Payment Required
    - 403: Forbidden => Client doesn't have rights to access
    - 404: Not found
    - 409: Conflict => Data from client conflicts with some data in server
    - 500: Internal Server Error: Server has error due to bug in codes or server has been shut down unexpectedly
*/

export async function POST(request: NextRequest, context: any) {
    const responseData = {
        message: '',
        description: '',
        status: '',
        code: 200,
        data: {}
    };
    try {

        const body = await request.json();
        const { id, userData, auth } = body;
        await upsertUser(collectionName, id, userData, auth).then((response: any) => {
            responseData.code = response.result.code;
            responseData.message = response.result.message;
            responseData.description = response.result.description;
            responseData.status = response.result.status;
        });
    } catch (error: any) {
        responseData.description = error.message;
        responseData.message = "SYSTEM ERROR";
        responseData.code = 500;
        responseData.status = "error"
    }

    return NextResponse.json(responseData);
}