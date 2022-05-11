import firebase from "firebase";

const config = {
  apiKey: "AIzaSyB5lXzMsD411a8EEjJNJxPp_6MnReyWxUQ",
  authDomain: "network-desk-163d7.firebaseapp.com",
  projectId: "network-desk-163d7",
  storageBucket: "network-desk-163d7.appspot.com",
  messagingSenderId: "1049688381642",
  appId: "1:1049688381642:web:097db826a430ba83163c33",
  measurementId: "G-PJHDW4XJK7",
};
firebase.initializeApp(config);

export { firebase };