import firebase from "firebase";

const config = {
  apiKey: "AIzaSyBsM59wDDpCg9JQf9Q7Bk44F93vSCIBy70",
  authDomain: "streetdrive-cb4a0.firebaseapp.com",
  databaseURL: "https://streetdrive-cb4a0.firebaseio.com",
  projectId: "streetdrive-cb4a0",
  storageBucket: "streetdrive-cb4a0.appspot.com",
  messagingSenderId: "886526762142",
  appId: "1:886526762142:web:5e1eb873d29ce6af61af8f",
  measurementId: "G-WB52GLTFJE",
};
firebase.initializeApp(config);
const db = firebase.firestore();
const auth = firebase.auth();

export { firebase, db, auth };
