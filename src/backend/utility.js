import firebase from "firebase";
// import firestore from "firebase/firestore";
const apiUrl = "https://network-desk-backend.herokuapp.com/api/";

var firebaseConfig = {
  apiKey: "AIzaSyCQYSdtrJWnPWm0q068qUuLVIi1Duk7VH8",
  authDomain: "network-desk.firebaseapp.com",
  databaseURL: "https://network-desk.firebaseio.com",
  projectId: "network-desk",
  storageBucket: "network-desk.appspot.com",
  messagingSenderId: "1018298334222",
  appId: "1:1018298334222:web:42aaf475a1152492fa905f",
  measurementId: "G-RW0G7FEPGT",
};
var fire = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

export async function connectFirebase() {}

export async function getUserId() {
  let userid = "";
  firebase.auth().then(function (user) {
    userid = user.user.uid;
  });
  return userid;
}

export async function getAllOfCollection(collection) {
  let data = [];
  let querySnapshot = await firebase.firestore().collection(collection).get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push(doc.data());
    } else {
      alert("No document found!");
    }
  });
  return data;
}

export async function getAllData(endpoint) {
  let data = [];
  data = await fetch(`${apiUrl}${endpoint}`)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
  return data;
}

export async function getDataById(url, reqBody) {
  try {
    let data = [];
    data = await fetch(`${apiUrl}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((res) => res);
    
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function addUpdateData(url, reqBody) {
  try {
    let result = {};
    result = await fetch(`${apiUrl}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((res) => res);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function searchData(url, reqBody) {
  try {
    let result = [];
    result = await fetch(`${apiUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    }).then(res => res.json()).then(res => res)
    return result
  } catch (error) {
    console.log(error);
  }
}

export async function getDataWithDoc(collection, doc) {
  let data = [];
  let user = await firebase.firestore().collection(collection).doc(doc).get();
  return user;
}

export async function getDataWithoutDoc(collection, objectKey) {
  let data = [];
  let user = await firebase
    .firestore()
    .collection(collection)
    .doc()
    .get(objectKey);
  return user;
}

export function getData(collection, doc, objectKey) {
  // check if data exists on the given path
  if (objectKey === undefined) {
    return firebase
      .firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          return false;
        }
      });
  } else {
    return firebase
      .firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(function (doc) {
        if (doc.exists && doc.data()[objectKey] != undefined) {
          return doc.data()[objectKey];
        } else {
          return false;
        }
      });
  }
}

export async function saveDataWithoutDocId(collection, jsonObject) {
  let upload = await firebase
    .firestore()
    .collection(collection)
    .doc()
    .set(jsonObject);
  return upload;
}

export async function saveData(collection, doc, jsonObject) {
  firebase
    .firestore()
    .collection(collection)
    .doc(doc)
    .set(jsonObject, { merge: true })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

export async function saveInitialData(collection, userId) {
  firebase
    .firestore()
    .collection(collection)
    .doc(userId)
    .set({ userdocc: "Me" })
    .then(function () {
      alert("Data saved succesfuly");
    })
    .catch(function (error) {
      alert(error);
    });
}

//Save coordinates of collector to firestore
export async function saveCoordinates(collection, doc, jsonObject) {
  firebase
    .firestore()
    .collection(collection)
    .doc(doc)
    .set({ jsonObject })
    .then(function () {
      console.log("Coordinates saved successfuly");
    })
    .catch({
      function(error) {
        console.log("Failed to save coordinates: ", error);
      },
    });
}

export async function addToArray(collection, doc, array, value) {
  var tempdoc = firebase.firestore().collection(collection).doc(doc);

  tempdoc
    .get()
    .then((docData) => {
      if (docData.exists) {
        firebase
          .firestore()
          .collection(collection)
          .doc(doc)
          .update({
            [array]: firebase.firestore.FieldValue.arrayUnion(value),
          });
      } else {
        firebase
          .firestore()
          .collection(collection)
          .doc(doc)
          .set({
            [array]: firebase.firestore.FieldValue.arrayUnion(value),
          });
      }

      console.log(docData);
    })
    .catch((fail) => {
      firebase
        .firestore()
        .collection(collection)
        .doc(doc)
        .set({
          [array]: firebase.firestore.FieldValue.arrayUnion(value),
        });

      console.log(fail);
    });
}

export async function updateData(collection, doc, array, value) {
  //alert(doc);
  firebase
    .firestore()
    .collection(collection)
    .doc(doc)
    .update({
      [array]: value,
    });
}

export async function deleteData(collection, doc, array, value) {
  //alert(doc);

  firebase
    .firestore()
    .collection(collection)
    .doc(doc)
    .update({ [array]: firebase.firestore.FieldValue.delete() });
}

export async function deleteRecord(endpoint, reqBody) {
  
  try {
    let result = await fetch(`${apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    }).then(res => res.json()).then(res => res);
    return result
  } catch (error) {
    console.log(error);
  }
}
