// Import the Firebase modules that you need in your app.
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
//https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
// Initalize and export Firebase.
const config = {
    apiKey: "AIzaSyDmSIAPrdDXrPPdl6ordLuiZe2GDq-D53U",
    authDomain: "cngt-fc7e0.firebaseapp.com",
    databaseURL: "https://cngt-fc7e0.firebaseio.com",
    projectId: "cngt-fc7e0",
    storageBucket: "cngt-fc7e0.appspot.com",
    messagingSenderId: "643837299658",
    appId: "1:643837299658:web:df6fb2c06acf14e1"
}
class Firebase {
    constructor() {
        firebase.initializeApp(config);

        this.auth = firebase.auth();
        this.db = firebase.firestore();
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);
}
const fb = new Firebase();
export {fb as FB};
