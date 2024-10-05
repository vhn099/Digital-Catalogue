import { firebaseApp } from '@/../firebase.config';
import { User } from '@/model/User';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

let auth = getAuth(firebaseApp);

export const loginFirebase = async (email: string, password: string) => {
    let results = {
        error: {
            code: '',
            message: '',
        },
        userModel: new User('', '', '', '')
    }
    await signInWithEmailAndPassword(auth, email, password).then((userCredentials) => {
        results.userModel.email = userCredentials.user.email;
        results.userModel.displayName = userCredentials.user.displayName;
        results.userModel.login = true;
    }).catch(async error => {
        results.error.code = error.code;
        results.error.message = error.message;
    });
    return results;
};