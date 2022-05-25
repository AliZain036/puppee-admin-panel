// import firebase from "firebase";
// import firestore from "firebase/firestore";
const apiUrl = "https://network-desk-backend.herokuapp.com/api/";
import SwalAutoHide from "sweetalert2";

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
    SwalAutoHide.fire({
      icon: "error",
      timer: 2000,
      title: "Failed.",
      showConfirmButton: false,
      text: error.message,
    });
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
    SwalAutoHide.fire({
      icon: "error",
      timer: 2000,
      title: "Failed.",
      showConfirmButton: false,
      text: error.message,
    });
  }
}

export async function getAllData(endpoint) {
  try {
    let data = [];
    data = await fetch(`${apiUrl}${endpoint}`).then((response) => {
      return response.json();
    });
    return data;
  } catch (error) {
    SwalAutoHide.fire({
      icon: "error",
      timer: 2000,
      title: "Failed.",
      showConfirmButton: false,
      text: error.message,
    });
  }
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
    SwalAutoHide.fire({
      icon: "error",
      timer: 2000,
      title: "Failed.",
      showConfirmButton: false,
      text: error.message,
    });
  }
}

export async function addUpdateData(url, reqBody) {
  try {
    let result = {};
    result = await fetch(`${apiUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((res) => res);
    return result;
  } catch (error) {
    SwalAutoHide.fire({
      icon: "error",
      timer: 2000,
      title: "Failed.",
      showConfirmButton: false,
      text: error.message,
    });
  }
}

export async function searchData(url, reqBody) {
  try {
    let result = [];
    result = await fetch(`${apiUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((res) => res);
    return result;
  } catch (error) {
    SwalAutoHide.fire({
      icon: "error",
      timer: 2000,
      title: "Failed.",
      showConfirmButton: false,
      text: error.message,
    });
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
    })
      .then((res) => res.json())
      .then((res) => res);
    return result;
  } catch (error) {
    SwalAutoHide.fire({
      icon: "error",
      timer: 2000,
      title: "Failed.",
      showConfirmButton: false,
      text: error.message,
    });
  }
}
