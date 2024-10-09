"use server"
import { getUsers } from "@/firebase/firestore/User";
import UserPageClient from "./UserPage";

export default async function User(req: { key: string }, res: any) {
    // const token = cookies[constants.FIREBASE_TOKEN];
    // onst auth = getAuth(firebase_app);
    const users = await getUsers("users");

    return (
        <UserPageClient users={users} />
    );
}