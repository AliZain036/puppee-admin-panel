// import firebase from "firebase";
// import firestore from "firebase/firestore";
const apiUrl = 'https://network-desk-backend.herokuapp.com/api/'
const baseUrl = 'https://184.169.179.30/'
const uploadSingleFileUrl = 'https://184.169.179.30:8080/upload-to-s3'

import axios from 'axios'
import SwalAutoHide from 'sweetalert2'

export async function login(reqBody) {
  try {
    let user = await axios.post(`${baseUrl}users/signin`, reqBody)
    return user.data
  } catch (error) {
    console.error(error)
    return error.response.data
  }
}

export async function logout() {
  try {
    let user = {}
    let reqBody
    let loggedInUser = JSON.parse(localStorage.getItem('user'))
    reqBody = { user_id: loggedInUser.id }
    user = await fetch(`${apiUrl}logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    })
      .then((response) => response.json())
      .then((data) => {
        return data
      })
    return user
  } catch (error) {
    SwalAutoHide.fire({
      icon: 'error',
      timer: 2000,
      title: 'Failed.',
      showConfirmButton: false,
      text: error.message,
    })
  }
}

export async function getAllData(endpoint = '') {
  try {
    let response = await axios.get(`${baseUrl}${endpoint}`)
    return response.data
  } catch (error) {
    console.error(error)
    SwalAutoHide.fire({
      icon: 'error',
      timer: 2000,
      title: 'Failed.',
      showConfirmButton: false,
      text: error.message,
    })
  }
}

export async function getDataById(url, reqBody) {
  try {
    let data = []
    data = await fetch(`${apiUrl}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((res) => res)

    return data
  } catch (error) {
    SwalAutoHide.fire({
      icon: 'error',
      timer: 2000,
      title: 'Failed.',
      showConfirmButton: false,
      text: error.message,
    })
  }
}

export async function addUpdateData(endpoint, reqBody) {
  try {
    let user = await axios.post(`${baseUrl}${endpoint}`, reqBody)
    return user.data
  } catch (error) {
    console.error(error)
    return error.response.data
  }
}

export async function updateRecord(endpoint, reqBody) {
  try {
    let response = await axios.put(`${baseUrl}${endpoint}`, reqBody)
    return response.data
  } catch (error) {
    console.error(error)
    return error.response.data
  }
}

export async function searchData(url, reqBody) {
  try {
    let result = []
    result = await fetch(`${baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((res) => res)
    return result
  } catch (error) {
    SwalAutoHide.fire({
      icon: 'error',
      timer: 2000,
      title: 'Failed.',
      showConfirmButton: false,
      text: error.message,
    })
  }
}

export async function deleteRecord(endpoint, reqBody) {
  try {
    let result = await axios.delete(`${baseUrl}${endpoint}`, { data: reqBody })
    return result
  } catch (error) {
    SwalAutoHide.fire({
      icon: 'error',
      timer: 2000,
      title: 'Failed.',
      showConfirmButton: false,
      text: error.message,
    })
  }
}

export const uploadSingleFile = async (file) => {
  try {
    let formData = new FormData()
    formData.append('file', file)
    let result = await axios.post(`${uploadSingleFileUrl}`, formData)
    return result
  } catch (error) {
    SwalAutoHide.fire({
      icon: 'error',
      timer: 2000,
      title: 'Failed.',
      showConfirmButton: false,
      text: error.message,
    })
  }
}
