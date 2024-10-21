const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require('firebase-admin');

admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const validateFirebaseIdToken = async (authorization) => {
    console.log('1 - TRIGGER TOKEN CHECK', "[1 - COMPLETED]");

    if (!authorization) {
        // console.error(
        //     'No Firebase ID token was passed as a Bearer token in the Authorization header.',
        //     'Make sure you authorize your request by providing the following HTTP header:',
        //     'Authorization: Bearer <Firebase ID Token>',
        //     'or by passing a "__session" cookie.'
        // );
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

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        console.log('3 - ID Token correctly decoded: ', decodedIdToken);
        return decodedIdToken;
    } catch (error) {
        console.log('3 - ERRORS IN VERIFYING FIREBASE ID TOKEN: ', "[3 - FAILURE]");
        return false;
    }
};

exports.helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });

    const authorization = request.headers.authorization;
    const dataToken = validateFirebaseIdToken(authorization)
    if (dataToken) {
        response.status(200).send(dataToken);
    } else {
        response.status(403).send("Unauthorize !");
    }
});
