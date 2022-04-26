import { method } from "lodash";

const apiUrl = "https://network-desk-backend.herokuapp.com/api/";

async function login(reqBody) {
  try {
    let user = {};
    user = await fetch(`${apiUrl}user-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      });
      return user;
  } catch (error) {
    console.log(error);
  }
}

async function setUserBlockStatus(url, requestBody) {
  try {
    let response = {};
    response = await fetch(`${apiUrl}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      });
      return response;
  } catch (error) {
    console.log(error);
  }
}

export { login, setUserBlockStatus }