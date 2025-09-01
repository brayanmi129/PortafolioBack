const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI,
    authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    clientC509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();
const storage = admin.storage().bucket();
module.exports = { db, storage };

// {
//     "user": {
//         "uid": "YSvUBYaxiXc1J1ed3BMTu5SPkRy1",
//         "email": "brakcris129@gmail.com",
//         "emailVerified": false,
//         "isAnonymous": false,
//         "providerData": [
//             {
//                 "providerId": "password",
//                 "uid": "brakcris129@gmail.com",
//                 "displayName": null,
//                 "email": "brakcris129@gmail.com",
//                 "phoneNumber": null,
//                 "photoURL": null
//             }
//         ],
//         "stsTokenManager": {
//             "refreshToken": "AMf-vBy8Rk7mJioleqxN833XzZU1rZv3WTMZKQHpqj8_qoChsRhsYyY0ryChpDjh5Hu3jKfOEj1iRpSOTZpB8D7Rm0awhnuL_aoiX5gzXBDYcaxuUN_fUZlyaR4fUH70IOABWBqRUjClk4uU5fe4eTWIMQno-ET9sIq18XWXYBzbMdcTQip5RAoZTEXWDB4QkJ9kgrE4BdrEX1zq1y3GoNm3CX3APPKGqw",
//             "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1MWRkZTkzMmViYWNkODhhZmIwMDM3YmZlZDhmNjJiMDdmMDg2NmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG9ydGFmb2xpby1kMzNhNyIsImF1ZCI6InBvcnRhZm9saW8tZDMzYTciLCJhdXRoX3RpbWUiOjE3NTM4MDU2NjcsInVzZXJfaWQiOiJZU3ZVQllheGlYYzFKMWVkM0JNVHU1U1BrUnkxIiwic3ViIjoiWVN2VUJZYXhpWGMxSjFlZDNCTVR1NVNQa1J5MSIsImlhdCI6MTc1MzgwNTY2NywiZXhwIjoxNzUzODA5MjY3LCJlbWFpbCI6ImJyYWtjcmlzMTI5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJicmFrY3JpczEyOUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.pGKzl9ha6dcQH7PKDMLyaA4VzhwGBmUhd-UN9m3aOMZrCI0c9uCllBXP2TtnqZqGQJ8O5yYp2f-FbUtDSfpDcnnoKejnlXozc9CVNYtQoNxSHEKvZJIutFrR2D1KLxielBALIN6wZ6RjXSdoeBWVaRP8-TzbUcNPLDN1xsTIrQSvIsth3y-8A0ah1AaXvRPOJYxd1a4lLoH0OeydU5FxX6RSHWR0DrcXzlW4De5AjDISJc6vAQktKk5EXo4HdZ7KDGLtWCFl4egYrOanYdfI481zIyvzAYGoBoUaUK7opDXrKkf2vsP0kKwXL-OXHyZJszcLZAP2tbrPUPExLMdEeg",
//             "expirationTime": 1753809263550
//         },
//         "createdAt": "1753803936966",
//         "lastLoginAt": "1753805636031",
//         "apiKey": "AIzaSyAJS6GqFkyAvmYHYBKB7Hzr1mUBP7CZoiY",
//         "appName": "[DEFAULT]"
//     },
//     "providerId": null,
//     "_tokenResponse": {
//         "kind": "identitytoolkit#VerifyPasswordResponse",
//         "localId": "YSvUBYaxiXc1J1ed3BMTu5SPkRy1",
//         "email": "brakcris129@gmail.com",
//         "displayName": "",
//         "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1MWRkZTkzMmViYWNkODhhZmIwMDM3YmZlZDhmNjJiMDdmMDg2NmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG9ydGFmb2xpby1kMzNhNyIsImF1ZCI6InBvcnRhZm9saW8tZDMzYTciLCJhdXRoX3RpbWUiOjE3NTM4MDU2NjcsInVzZXJfaWQiOiJZU3ZVQllheGlYYzFKMWVkM0JNVHU1U1BrUnkxIiwic3ViIjoiWVN2VUJZYXhpWGMxSjFlZDNCTVR1NVNQa1J5MSIsImlhdCI6MTc1MzgwNTY2NywiZXhwIjoxNzUzODA5MjY3LCJlbWFpbCI6ImJyYWtjcmlzMTI5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJicmFrY3JpczEyOUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.pGKzl9ha6dcQH7PKDMLyaA4VzhwGBmUhd-UN9m3aOMZrCI0c9uCllBXP2TtnqZqGQJ8O5yYp2f-FbUtDSfpDcnnoKejnlXozc9CVNYtQoNxSHEKvZJIutFrR2D1KLxielBALIN6wZ6RjXSdoeBWVaRP8-TzbUcNPLDN1xsTIrQSvIsth3y-8A0ah1AaXvRPOJYxd1a4lLoH0OeydU5FxX6RSHWR0DrcXzlW4De5AjDISJc6vAQktKk5EXo4HdZ7KDGLtWCFl4egYrOanYdfI481zIyvzAYGoBoUaUK7opDXrKkf2vsP0kKwXL-OXHyZJszcLZAP2tbrPUPExLMdEeg",
//         "registered": true,
//         "refreshToken": "AMf-vBy8Rk7mJioleqxN833XzZU1rZv3WTMZKQHpqj8_qoChsRhsYyY0ryChpDjh5Hu3jKfOEj1iRpSOTZpB8D7Rm0awhnuL_aoiX5gzXBDYcaxuUN_fUZlyaR4fUH70IOABWBqRUjClk4uU5fe4eTWIMQno-ET9sIq18XWXYBzbMdcTQip5RAoZTEXWDB4QkJ9kgrE4BdrEX1zq1y3GoNm3CX3APPKGqw",
//         "expiresIn": "3600"
//     },
//     "operationType": "signIn"
// }
