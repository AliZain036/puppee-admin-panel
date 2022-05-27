import React, { useEffect, useState } from 'react'
import { addUpdateData, getAllData, getDataById } from '../backend/utility'
import SwalAutoHide from 'sweetalert2'
import axios from 'axios'

const UpdateUser = (props) => {
  const [users, setUsers] = useState([])
  const [user, setUser] = useState({})
  const [userToUpdate, setUserToUpdate] = useState({
    first_name: '',
    last_name: '',
    image: null,
    email: '',
    phone: '',
    office: '',
    profession: '',
    user_id: '',
  })

  useEffect(() => {
    getUser()
    return () => {}
  }, [])

  const getUser = async () => {
    try {
      let { userId } = props.match.params
      let reqBody = {
        user_id: userId,
      }
      let response = await getDataById('show-single-user', reqBody)
      if (response.data !== null) {
        let user = response.data
        setUserToUpdate({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          office: user.profile && user.profile.company_name,
          phone: user.phone,
          profession: user.profile && user.profile.profession,
          user_id: user.id,
        })
      }
    } catch (error) {
      SwalAutoHide.fire({
        icon: 'error',
        timer: 2000,
        title: 'Failed.',
        showConfirmButton: false,
        text: 'No record found!',
      })
    }
  }

  const selectedFileHandler = (e) => {
    setUserToUpdate({ ...userToUpdate, image: e.target.files[0] })
  }

  const handleChange = (e) => {
    if (e.target.value) {
      console.log(e.target.name, e.target.value)
      setUserToUpdate({ ...userToUpdate, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    try {
    e.preventDefault()
    let fd = new FormData()
    if(userToUpdate.image) {
      fd.append('image', userToUpdate.image)
    }
    fd.append('first_name', userToUpdate.first_name)
    fd.append('last_name', userToUpdate.last_name)
    fd.append('profession', userToUpdate.profession)
    fd.append('office', userToUpdate.office)
    fd.append('email', userToUpdate.email)
    fd.append('phone', userToUpdate.phone)
    fd.append('user_id', userToUpdate.user_id)
      axios
        .post(
          'https://network-desk-backend.herokuapp.com/api/admin-update-user',
          fd,
        )
        .then((res) => {
          if (res.data != null) {
            SwalAutoHide.fire({
              icon: 'success',
              timer: 2000,
              title: 'Success.',
              showConfirmButton: false,
              text: 'User details updated successfully',
            })
            props.history.push('/customers')
          }
        })
    } catch (error) {
      if (res.data != null) {
        SwalAutoHide.fire({
          icon: 'error',
          timer: 2000,
          title: 'Failed.',
          showConfirmButton: false,
          text: 'Something went wrong!',
        })
      }
    }
  }

  return (
    <div className="row fadeIn animated">
      <div className="col-12">
        <h3>Update User</h3>
      </div>
      <div className="col-6 col-xs-12">
        <div className="user-details-section">
          <form onSubmit={(e) => handleSubmit(e)} id="userUpdateForm">
            <div className="form-group">
              <label htmlFor="profile-image">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                name="profile-image"
                id="profile-image"
                className="form-control"
                onChange={(e) => selectedFileHandler(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="first-name">First Name</label>
              <input
                type="text"
                name="first_name"
                required
                id="first_name"
                className="form-control"
                value={userToUpdate.first_name || ""}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input
                type="text"
                required
                name="last_name"
                id="last-name"
                className="form-control"
                value={userToUpdate.last_name || ""}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={userToUpdate.email || ""}
                id="email"
                className="form-control"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="profession">Profession</label>
              <input
                type="text"
                name="profession"
                id="profession"
                value={userToUpdate.profession || ""}
                className="form-control"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="office">Office</label>
              <input
                type="text"
                name="office"
                value={userToUpdate.office || ""}
                id="office"
                className="form-control"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone-number">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={userToUpdate.phone || ""}
                id="phone-number"
                className="form-control"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-success">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateUser
