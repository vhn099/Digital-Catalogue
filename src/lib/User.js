import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";

import { useAppStore } from "@/stores";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { COMMON_VARIABLE } from "./Common";

export const UserFirestore = {
    async getCurrentUser() {
        const result = {
            status: 'success',
            message: '',
            isAdmin: false,
        };
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        const currentUser = getAuth().currentUser;
        if (!currentUser) {
            result.status = 'error';
            result.message = useAppStore().getMessageMaster.AUTH.NOT_LOGGED_IN;
        } else {
            const email = currentUser.email;
            const userQuery = query(db, where('email', "==", email));
            const userDoc = await getDocs(userQuery);

            if (userDoc.docs.length > 0) {
                const userData = userDoc.docs[0].data();
                result.isAdmin = userData.isAdmin || false;
                const disabled = userData.disabled;
                if (disabled) {
                    result.status = 'error';
                    result.message = useAppStore().getMessageMaster.AUTH.BLOCKED;
                }
            } else {
                result.status = 'error';
                result.message = useAppStore().getMessageMaster.AUTH.NOT_EXISTED_ACCOUNT;
            }
        }
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
            let findUser = await getDocs(query(db, where('email', '==', userForm.username)));
            if (findUser.docs.length === 0) {
                const userData = {
                    email: userForm.username,
                    firstname: userForm.firstname || '',
                    lastname: userForm.lastname || '',
                    isAdmin: userForm.isAdmin || false,
                    disabled: false,
                    // created: userForm.created,
                    created_by: userForm.created_by,
                    // updated: userForm.updated,
                    updated_by: userForm.updated_by
                };
                const userToken = await getAuth().currentUser.getIdToken();
                await axios.post(COMMON_VARIABLE.CREATE_USER_FUNCTION, {
                    userForm: userData,
                    password: userForm.password
                }, {
                    headers: { Authorization: `Bearer ${userToken}` }
                }).then(response => {
                    if (response.status != 200) {
                        result.status = 'error';
                        result.message = response.data.message;
                        console.log(response.data, "RESPONSE");
                    } else {
                        result.message = useAppStore().getMessageMaster.DATA(userForm.username).USER_CREATED;
                    }
                }).catch(error => {
                    
                });
            } else {
                result.message = useAppStore().getMessageMaster.DATA(userForm.username).USER_EXISTED;
                result.status = 'warn';
            }
        } catch (error) {
            result.status = 'error';
            result.message = error.message;

        }

        return result;
    },
    async updateUser(userForm) {
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        const currentUser = await this.getCurrentUser();
        const result = {
            status: 'success',
            message: '',
            data: {}
        };
        // Check current operation of the current user if they are admin but suddenly got remove role.
        if (!currentUser.isAdmin) {
            result.status = 'error',
                result.message = useAppStore().getMessageMaster.ADMIN_SITE.NO_PERMISSION;
            result.data = {};
            return result;
        }
        try {
            const docRef = getDoc(doc(db, userForm.id));
            if ((await docRef).exists()) {
                await updateDoc(doc(db, userForm.id), {
                    isAdmin: userForm.isAdmin || false,
                    firstname: userForm.firstname || "",
                    lastname: userForm.lastname || "",
                    updated: userForm.updated,
                    updated_by: userForm.updated_by
                }).then(response => {
                    result.message = useAppStore().getMessageMaster.DATA(userForm.username).USER_UPDATE;
                });
            } else {
                result.message = useAppStore().getMessageMaster.DATA(userForm.username).USER_NOT_EXISTED;
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
        const currentUser = await this.getCurrentUser();
        const result = {
            status: 'success',
            message: '',
            data: {}
        };
        // Check current operation of the current user if they are admin but suddenly got remove role.
        if (!currentUser.isAdmin) {
            result.status = 'error',
                result.message = useAppStore().getMessageMaster.ADMIN_SITE.NO_PERMISSION;
            result.data = {};
            return result;
        }
        try {
            const docRef = doc(db, userID);
            await updateDoc(docRef, {
                disabled: true,
                updated: updated,
                updated_by: updated_by
            }).then(response => {
                result.message = useAppStore().getMessageMaster.DATA(email).USER_DELETE;
            });
        } catch (error) {
            result.status = 'error';
            result.message = error.message;
        }
        return result;
    }
};