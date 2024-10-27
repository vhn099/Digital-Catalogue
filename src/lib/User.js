import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";

import { useAppStore } from "@/stores";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { COMMON_VARIABLE } from "./Common";

export const UserFirestore = {
    setCookie(key, value, days) {
        let expires = '';
        if (days) {
            let date = new Date();
            const oneDayTime = 24 * 60 * 60 * 1000 // 1 day
            date.setTime(date.getTime() + (days * oneDayTime));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = key + "=" + (value || "") + expires + "; path=/";
    },

    getCookie(name) {
        let cname = name + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    },

    async getCurrentUser() {
        const result = {
            status: 'success',
            message: '',
            userData: {}
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
                result.userData = userData;
                result.userData.id = userDoc.docs[0].id;
                const disabled = result.userData.disabled;
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

    async checkUserPermissionBeforeAction() {
        const currentUser = await this.getCurrentUser();
        const result = {
            status: 'success',
            message: '',
            data: {}
        };
        // Check current operation of the current user if they are admin but suddenly got remove role.
        if (currentUser.userData) {
            if (!currentUser.userData.isAdmin) {
                result.status = 'error';
                result.message = useAppStore().getMessageMaster.ADMIN_SITE.NO_PERMISSION;
                return result;
            }
        } else {
            result.status = 'error';
            result.message = useAppStore().getMessageMaster.AUTH.NOT_EXISTED_ACCOUNT;
        }
        return result;
    },

    //get user name base on email
    async getUserName(emailID) {
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        const userQuery = query(db, where('email', "==", emailID));
        const userDoc = await getDocs(userQuery);

        if (userDoc.docs.length > 0) {
            const userData = userDoc.docs[0].data();
            const userName = userData.firstname ? userData.firstname : '' + " " + userData.lastname ? userData.lastname : '';
            if (userName) {
                return userName;
            } else {
                return emailID;
            }

        } else {
            return false;
        }
    },
    //get user base on email
    async getUser(emailID) {
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        const userQuery = query(db, where('email', "==", emailID));
        const userDoc = await getDocs(userQuery);

        if (userDoc.docs.length > 0) {
            const userData = userDoc.docs[0].data();
            return userData;
        } else {
            return false;
        }
    },
    async getUsers() {
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        // const userQuery = query(db, where("disabled", '==', false));
        let snapshot = await getDocs(db);
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
    async updateMyProfile(userForm) {
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        let result = {
            status: 'success',
            message: '',
            data: {}
        };
        try {
            const docRef = getDoc(doc(db, userForm.id));
            if ((await docRef).exists()) {
                console.log(userForm);
                await updateDoc(doc(db, userForm.id), {
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
    async updateUser(userForm) {
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        let result = {
            status: 'success',
            message: '',
            data: {}
        };
        // Check current operation of the current user if they are admin but suddenly got remove role.
        const checkPermission = await this.checkUserPermissionBeforeAction();
        if (checkPermission.status !== 'success') {
            result = checkPermission;
            return result;
        }
        try {
            const docRef = getDoc(doc(db, userForm.id));
            if ((await docRef).exists()) {
                let disabled = false;
                if (userForm.deactive.length > 0) {
                    disabled = true;
                }
                await updateDoc(doc(db, userForm.id), {
                    disabled: disabled,
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
        let result = {
            status: 'success',
            message: '',
            data: {}
        };
        // Check current operation of the current user if they are admin but suddenly got remove role.
        const checkPermission = await this.checkUserPermissionBeforeAction();
        if (checkPermission.status !== 'success') {
            result = checkPermission;
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