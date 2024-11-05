const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });
const admin = require('firebase-admin');
const environment = require('./env.json');
const { getAuth } = require("firebase-admin/auth");
const collections = {
    USERS: 'users'
}

const validateFirebaseIdToken = async (authorization) => {
    console.log('1 - TRIGGER TOKEN CHECK', "[1 - COMPLETED]");

    if (!authorization) {
        console.log('1 - NO AUTHENTICATION FOUND IN HEADER', "[1 - FAILURE]");
        return false;
    }

    let idToken;
    if (authorization && authorization.startsWith('Bearer ')) {
        console.log('2 - FOUND "Authorization" IN HEADER', "[2 - COMPLETED]");
        // Read the ID Token from the Authorization header.
        idToken = authorization.split('Bearer ')[1];
    } else {
        // No cookie
        console.log('2 - NOT FOUND "Authorization" IN HEADER', "[2 - FAILURE]");
        return false;
    }
    console.log(idToken);
    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        console.log(`3 - ID Token correctly decoded: ${JSON.stringify(decodedIdToken)}`, '[3 - COMPLETED]');
        return decodedIdToken;
    } catch (error) {
        console.log(`3 - ERRORS IN VERIFYING FIREBASE ID TOKEN: ${idToken}`, "[3 - FAILURE]");
        return false;
    }
};

exports.createUsers = onRequest(async (request, response) => {
    cors(request, response, async () => {
        const authorization = request.headers.authorization;
        if (admin.apps.length === 0) {
            admin.initializeApp(environment.FIREBASE_INFO);
        }
        try {
            const dataToken = await validateFirebaseIdToken(authorization);
            if (dataToken.email) {
                const userFirestore = await admin.firestore().collection(collections.USERS).where('email', '==', dataToken.email).get();
                if (userFirestore.docs.length > 0) {
                    const userDoc = userFirestore.docs[0].data();
                    const isAdmin = userDoc.isAdmin;
                    console.log(`4 - CHECKING IF USER ${userDoc.email} IS ADMIN - PERMISSION: ${isAdmin}`, "[4 - COMPLETED]");
                    if (!isAdmin) {
                        response.status(401).send({
                            message: 'User is not admin to do this action'
                        });
                    } else {
                        const { body } = request;
                        const userForm = body.userForm;
                        const password = body.password;
                        console.log(`5 - GETTING BODY SUCCESSFUL - BODY INFO: ${body}`, "[5 - COMPLETED]");

                        await getAuth().createUser({
                            email: userForm.email,
                            displayName: userForm.firstname + " " + userForm.lastname,
                            emailVerified: false,
                            password: password,
                            disabled: false
                        }).then(async user => {
                            console.log(`6 - CREATE FIREBASE AUTHEN USERS - USER WITH EMAIL ${user.email}`, "[6 COMPLETED]");
                            userForm.created = new Date();
                            userForm.updated = new Date();
                            await admin.firestore().collection(collections.USERS).doc(user.uid).set(userForm).then(async (usrDoc) => {
                                console.log(`7 - CREATED USER IN FIRESTORE - USER ID: ${user.uid} - INFO:  ${JSON.stringify(userForm)}`, "[7 COMPLETED]");
                            }).catch((error) => {
                                console.log(`7 - CREATED USER IN FIRESTORE FAILED - INFO ${JSON.stringify(userForm)}`, "[7 FAILURE]");
                                console.log(error);
                                response.status(500).send({
                                    message: 'Create user in firebase failed.'
                                });
                                throw error;
                            });
                        }).catch(error => {
                            console.log(`6 - CREATE FIREBASE AUTHEN USERS FAILED - USER EMAIL ${userForm.email}`, "[6 FAILURE]");
                            console.log(error);
                            response.status(500).send({
                                message: 'Create user in firebase failed.'
                            });
                            throw error;
                        });
                        response.status(200).send({
                            message: ''
                        });
                    }
                } else {
                    response.status(403).send({
                        message: 'User who operates this action is not existed in the system.'
                    });
                }
            } else {
                response.status(403).send({
                    message: 'No permission to procceed this kind of request'
                });
            }
        } catch (error) {
            console.log("UNKNOWN - THERE WAS AN ERROR OCCUR - ERROR DETAILS: " + error);
            response.status(500).send({
                message: error.message
            });
            throw error;
        }
    });
});
