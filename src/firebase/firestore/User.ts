import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";
import firebase_app from "../config";
import { addDoc, collection, doc, DocumentData, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { formatDate } from "@/lib/lib";

const db = getFirestore(firebase_app);

interface User {
    key: string,
    email: string,
    full_name: string,
    created: Date
}

export async function getUsers(collectionName: any) {
    let result: DocumentData = [];
    let error = null;
    try {
        result = await getDocs(collection(db, collectionName));

        const data: User[] = result.docs.map((doc: any) => ({
            key: doc.id,
            email: doc.data().email,
            full_name: doc.data().full_name,
            // created: formatDate(doc.data().created)
            // ...doc.data(),
        })) as User[];
        return data;
    } catch (e) {
        error = e;
    }
    return error;
}

export async function upsertUser(collectionName: string, id: string, userData: any, auth: any) {
    let result: any = {
        status: 'success',
        code: 200
    };
    let error = null;
    try {
        if (id) {
            await setDoc(doc(collection(db, collectionName), id), userData).then((response: any) => {
                result = {
                    status: 'success',
                    code: 204,
                    message: 'Update Successful',
                    description: `Update user ${response.email} information successfully !`
                }
            });
        } else {
            const userQuery = query(
                collection(db, collectionName),
                where('email', '==', userData.email)
            );
            const isExist = (await getDocs(userQuery)).docs;
            if (isExist.length === 0) {
                await addDoc(collection(db, collectionName), userData).then(async (addDocRes: any) => {
                    result.status = 'success';
                    result.firebase_auth = 'success';
                    result.message = "Add Successful"
                    result.description = `Added user with email ${userData.email}`
                });
            } else {
                result.code = 409;
                result.status = 'warning';
                result.message = "WARNING";
                result.description = `User ${isExist[0].data().email} has already existed in the system!`
            }
        }
    } catch (e: any) {
        error = e;
        result.code = 500;
        result.status = 'error';
        result.message = "SYSTEM ERROR"
        result.description = `System returns error: ${error.message}`
    }

    return { result, error };
}