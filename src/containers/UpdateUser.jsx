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
    phone_number: '',
    office: '',
    profession: '',
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
          phone_number: user.phone_number,
          profession: user.profile && user.profile.profession,
          image: user.profile && user.profile.profile_image,
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

  const getAllUsers = async () => {
    let users = await getAllData('show-users')
    if (users.data && users.data.length > 0) {
      let { userId } = props.match.params
      let editUser = users.data.find((user) => user.id === +userId)
      setUserToUpdate({
        ...userToUpdate,
        first_name: editUser.first_name,
        last_name: editUser.last_name,
        profession: editUser.profile && editUser.profile.profession,
        phone_number: editUser.phone_number,
        email: editUser.email,
        office: editUser.profile && editUser.profile.company_name,
        image: editUser.profile && editUser.profile.profile_image,
      })
      setUsers(users)
      setUser(editUser)
    }
  }

  const selectedFileHandler = (e) => {
    setUserToUpdate({ ...userToUpdate, image: e.target.files[0] })
  }

  const handleChange = (e) => {
      debugger
    if (e.target.value) {
      console.log(e.target.name, e.target.value)
      setUserToUpdate({ ...userToUpdate, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let fd = new FormData()
    fd.append('image[]', userToUpdate.image, userToUpdate.image.name)
    fd.append('first_name', userToUpdate.first_name)
    fd.append('last_name', userToUpdate.last_name)
    fd.append('profession', userToUpdate.profession)
    fd.append('office', userToUpdate.office)
    fd.append('email', userToUpdate.email)
    fd.append('phone_number', userToUpdate.phone_number)
    axios.post('')
    let response = await addUpdateData('admin-update-user', fd)
    debugger
  }

  console.log(userToUpdate)

  return (
    <div className="row fadeIn animated">
      <div className="col-12">
        <h3>Update User</h3>
      </div>
      <div className="col-6 col-xs-12">
        <div className="user-details-section">
          <form onSubmit={(e) => handleSubmit(e)}>
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
                id="first_name"
                className="form-control"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input
                type="text"
                name="last_name"
                id="last-name"
                className="form-control"
                value={userToUpdate.last_name}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={userToUpdate.email}
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
                value={userToUpdate.profession}
                className="form-control"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="office">Office</label>
              <input
                type="text"
                name="office"
                value={userToUpdate.office}
                id="office"
                className="form-control"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone-number">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={userToUpdate.phone_number}
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
