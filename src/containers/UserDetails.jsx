import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SwalAutoHide from 'sweetalert2'
import { getAllData } from '../backend/utility'
import ReactPhoneInput from 'react-phone-input-2'

const UserDetails = ({ props }) => {
  const urlPathName = window.location.pathname.split('/')
  const userId = urlPathName[urlPathName.length - 1]
  const [userDetails, setUserDetails] = useState(null)
  useEffect(() => {
    getUserDetails()
  }, [])

  const getUserDetails = async () => {
    let result = await getAllData(`users/${userId}`)
    if (result && result.success === true && result.statusCode === 200) {
      setUserDetails(result.data)
    }
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12 p-0">
        <h3>User Details</h3>
        {userDetails && (
          <div className="row">
            <div className="col-12 mt-2">
              <label className="m-0">Profile Image: </label>
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
                readOnly
                value={userDetails.first_name}
                className="w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-2">
              <label className="m-0">Last Name: </label>
              <input
                type="text"
                readOnly
                value={userDetails.last_name}
                className="w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-2">
              <label className="m-0">Email: </label>
              <input
                type="text"
                readOnly
                value={userDetails.email}
                className="w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-2">
              <label className="m-0">Country: </label>
              <input
                type="text"
                readOnly
                value={userDetails.country}
                className="w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-2">
              <label className="m-0">City: </label>
              <input
                type="text"
                readOnly
                value={userDetails.city}
                className="w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-2">
              <label className="m-0">State: </label>
              <input
                type="text"
                readOnly
                value={userDetails.state}
                className="w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-2">
              <label className="m-0">Phone Number: </label>
              <input
                type="text"
                readOnly
                value={userDetails.phone_number}
                className="w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-2">
              <label className="m-0">User Type: </label>
              <input
                type="text"
                readOnly
                value={userDetails.user_type}
                className="w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-2">
              <label className="m-0">Gender: </label>
              <input
                type="text"
                readOnly
                value={userDetails.gender}
                className="w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-2">
              <label className="m-0">Rating: </label>
              <input
                type="text"
                readOnly
                value={userDetails.rating}
                className="w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-2">
              <label className="m-0">Occupation: </label>
              <input
                type="text"
                readOnly
                value={userDetails.occupation}
                className="w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-2">
              <label className="m-0">Main Language: </label>
              <input
                type="text"
                readOnly
                value={userDetails.main_language}
                className="w-100"
              />
            </div>
          </div>
        )}
        <div className='mt-3'>
          <Link to={'/users'}>
            <button className="btn btn-primary">Back</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
