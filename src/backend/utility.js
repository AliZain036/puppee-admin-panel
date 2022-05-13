// import firebase from "firebase";
// import firestore from "firebase/firestore";
const apiUrl = "https://network-desk-backend.herokuapp.com/api/";


export async function login(reqBody) {
  try {
    let user = {};
    user = await fetch(`${apiUrl}user-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function logout() {
  try {
    let user = {};
    let reqBody;
    let loggedInUser = JSON.parse(localStorage.getItem("user"));
    reqBody = { user_id: loggedInUser.id };
    user = await fetch(`${apiUrl}logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    return user;
  } catch (error) {
    console.log(error);
  }
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
