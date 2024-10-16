import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";

import { useAppStore } from "@/stores";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export const UserFirestore = {
    async getCurrentUser() {
        const result = {
            status: 'success',
            message: '',
        };
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        const currentUser = getAuth().currentUser;
        if (!currentUser) {
            result.status = 'error';
            result.message = 'User is not logged in to the system';
        } else {
            const email = currentUser.email;
            const userQuery = query(db, where('email', "==", email));
            const userDoc = await getDocs(userQuery);

            if (userDoc.docs.length > 0) {
                const userData = userDoc.docs[0].data();
                const disabled = userData.disabled;
                if (disabled) {
                    result.status = 'error';
                    result.message = "User's account is blocked";
                }
            } else {
                result.status = 'error';
                result.message = "User's account is either blocked or not activated in the system";
            }
        }
        console.log(result);
        return result;
    },

    async getUsers() {
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        const userQuery = query(db, where("disabled", '==', false));
        let snapshot = await getDocs(userQuery);
        return snapshot.docs;
    },

    async createUsers(userForm) {
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        const result = {
            status: 'success',
            message: '',
            data: {}
        };
        try {
            let findUser = await getDocs(query(db, where('email', '==', userForm.email_form)));
            if (findUser.docs.length === 0) {
                await createUserWithEmailAndPassword(getAuth(), userForm.email_form, userForm.password).then(async response => {
                    const userDoc = doc(getFirestore(), useAppStore().getUsersCollection, response.user.uid);
                    // Set user with custom sys_id in firestore
                    await setDoc(userDoc, {
                        email: userForm.email_form,
                        full_name: userForm.full_name,
                        isAdmin: userForm.isAdmin,
                        disabled: false,
                        created: userForm.created,
                        created_by: userForm.created_by,
                        updated: userForm.updated,
                        updated_by: userForm.updated_by
                    }).then(async response => {
                        result.message = `Created user with email ${result.data.email}`;
                    });
                });
            } else {
                result.message = `Email ${userForm.email} has already existed`;
                result.status = 'warning';
            }
        } catch (error) {
            result.status = 'error';
            result.message = error.message;

        }

        return result;
    },
    async updateUser(userForm) {
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        const result = {
            status: 'success',
            message: '',
            data: {}
        };
        try {
            const docRef = getDoc(doc(db, userForm.id));
            if ((await docRef).exists()) {
                await updateDoc(doc(db, userForm.id), {
                    full_name: userForm.full_name,
                    updated: userForm.updated,
                    updated_by: userForm.updated_by
                }).then(response => {
                    result.message = `Update user with email ${userForm.email} successfully`;
                });
            } else {
                result.message = `Email ${userForm.email} is not existed`;
                result.status = 'warning';
            }
        } catch (error) {
            result.status = 'error';
            result.message = error.message;

        }
        return result;
    },
    async deleteUser(userID, email, updated, updated_by) {
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        const result = {
            status: 'success',
            message: '',
            data: {}
        };
        try {
            const docRef = doc(db, userID);
            console.log(docRef, "DOC REF");
            await updateDoc(docRef, {
                disabled: true,
                updated: updated,
                updated_by: updated_by
            }).then(response => {
                result.message = `Delete user with email ${email} successfully`;
            });
        } catch (error) {
            result.status = 'error';
            result.message = error.message;
        }
        return result;
    }
};