import { Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import SwalAutoHide from 'sweetalert2'
import { addUpdateData, getAllData } from '../backend/utility'
const { Option } = Select

const UpdateUser = ({ props }) => {
  const urlPathName = window.location.pathname.split('/')
  const userId = urlPathName[urlPathName.length - 1]
  const [userDetails, setUserDetails] = useState({
    birth_day: '',
    city: '',
    country: '',
    country_code: '',
    country_phone_code: '',
    profile_image_url: '',
    patch_video_url: '',
    past_work_images: [],
    first_name: '',
    gender: '',
    interests: [],
    i_am_a: [],
    is_phone_number_verified: true,
    service_provider_image: '',
    last_name: '',
    main_language: '',
    occupation: '',
    phone_number: '',
    seller_stripe_account_id: '',
    state: '',
    expertise: '',
    cover_image: '',
    user_name: '',
    user_type: '',
    business_title: '',
    is_online: false,
    seller_affiliate_link: [],
    userId: '',
    rating: 2,
    location: {
      type: '',
      coordinates: [],
    },
    email: '',
    password: '',
    blocked: false,
  })
  useEffect(() => {
    getUserDetails()
  }, [])

  const getUserDetails = async () => {
    let result = await getAllData(`users/${userId}`)
    if (result && result.success === true && result.statusCode === 200) {
      console.log(result.data)
      setUserDetails(result.data)
    }
  }

  const handleChange = (e) => {
    e.persist()
    setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let body = {
      ...userDetails,
      userId: userDetails._id,
      seller_stripe_account_id: userDetails.seller_stripe_account_id || 'false',
    }
    body.rating = Number(userDetails.rating)
    let result = await addUpdateData('users/profile', body)
    if (result && result.success === true && result.data) {
      Swal.fire({
        title: 'User Details Updated Successfully',
        icon: 'success',
        timer: 2000,
      })
      history.pushState('', '', '/users')
    }
  }

  const handleProfileImageChange = (e) => {
    e.persist()
    if (!e.target.files[0]) return
    const profile_image_url = URL.createObjectURL(e.target.files[0])
    setUserDetails((prev) => ({ ...prev, profile_image_url }))
  }

  console.log(userDetails.gender)

  return (
    <div className="row animated fadeIn">
      <div className="col-12 p-0">
        <h3>Update User Details</h3>
        {userDetails && (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <h5>Personal Details:</h5>
              <div className="col-12 col-md-6">
                <label className="m-0">Profile Image: </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </div>
              <div className="col-12 mt-2">
                <img
                  src={userDetails.profile_image_url}
                  alt=""
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    width: '200px',
                    height: '200px',
                  }}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">First Name: </label>
                <input
                  type="text"
                  value={userDetails.first_name}
                  className="w-100"
                  name="first_name"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Last Name: </label>
                <input
                  type="text"
                  value={userDetails.last_name}
                  className="w-100"
                  name="last_name"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Email: </label>
                <input
                  type="text"
                  value={userDetails.email}
                  className="w-100"
                  name="email"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Country: </label>
                <input
                  type="text"
                  value={userDetails.country}
                  className="w-100"
                  name="country"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">City: </label>
                <input
                  type="text"
                  value={userDetails.city}
                  className="w-100"
                  name="city"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">State: </label>
                <input
                  type="text"
                  value={userDetails.state}
                  className="w-100"
                  name="state"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Phone Number: </label>
                <input
                  type="text"
                  value={userDetails.phone_number}
                  className="w-100"
                  name="phone_number"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Gender: </label>
                <select
                  name="gender"
                  className="w-100"
                  onChange={(e) => {
                    e.persist()
                    setUserDetails((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }}
                  value={userDetails.gender}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Rating: </label>
                <input
                  type="number"
                  value={userDetails.rating}
                  className="w-100"
                  name="rating"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Occupation: </label>
                <input
                  type="text"
                  value={userDetails.occupation}
                  className="w-100"
                  name="occupation"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Main Language: </label>
                <input
                  type="text"
                  value={userDetails.main_language}
                  className="w-100"
                  name="main_language"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              {/* <h5>Qualification Details: </h5> */}
              {/* {userDetails.} */}
            </div>
            <button className={`btn btn-sm btn-success mt-3`} type="submit">
              Update
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default UpdateUser
