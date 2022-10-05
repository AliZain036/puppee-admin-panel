import { Select, Input, InputNumber } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import SwalAutoHide from 'sweetalert2'
import { addUpdateData, getAllData, uploadSingleFile } from '../backend/utility'
const { Option } = Select
import ReactPhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import { Country, State, City } from 'country-state-city'

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
  const [occupations, setOccupations] = useState([])
  const [languages, setLanguages] = useState([])
  useEffect(() => {
    getUserDetails()
    getAllOccupations()
    getAllLanguages()
  }, [])

  const getAllOccupations = async () => {
    const result = await getAllData('occupations')
    if (result && result.success === true) {
      setOccupations(result.data)
    }
  }

  const getAllLanguages = async () => {
    const result = await getAllData('languages')
    if (result && result.success === true) {
      setLanguages(result.data)
    }
  }

  const [location, setLocation] = useState({
    conutries: Country.getAllCountries(),
    states: [],
    cities: [],
  })

  const getUserDetails = async () => {
    let result = await getAllData(`users/${userId}`)
    if (result && result.success === true && result.statusCode === 200) {
      console.log(result.data, ' ==== user-details')
      setUserDetails(result.data)
    }
  }

  const handleChange = (e) => {
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
    body.country = userDetails.country.name
    body.state = userDetails.country.state
    body.city = userDetails.country.city
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

  const handleProfileImageChange = async (e) => {
    e.persist()
    if (!e.target.files[0]) return
    let result = await uploadSingleFile(e.target.files[0])
    if (result && result.data.success === true) {
      setUserDetails((prev) => ({
        ...prev,
        profile_image_url: result.data.url,
      }))
    }
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12 p-0">
        <h3>Update User Details</h3>
        {userDetails && (
          <form onSubmit={handleSubmit}>
            <div className="row px-3 mt-3">
              <div className="col-12 col-md-6">
                <label className="m-0">Upload Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  style={{ width: '90px' }}
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
                <Input
                  type="text"
                  value={userDetails.first_name}
                  className="w-100"
                  name="first_name"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Last Name: </label>
                <Input
                  type="text"
                  value={userDetails.last_name}
                  className="w-100"
                  name="last_name"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Email: </label>
                <Input
                  type="email"
                  value={userDetails.email}
                  className="w-100"
                  name="email"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Country: </label>
                <Select
                  showSearch
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={true}
                  value={userDetails.country}
                  className="w-100"
                  onChange={(country) => {
                    const selectedCountry = location.conutries.find(
                      (el) => el.name === country,
                    )
                    setLocation((prev) => ({
                      ...prev,
                      states: State.getStatesOfCountry(selectedCountry.isoCode),
                    }))
                    setUserDetails((prev) => ({
                      ...prev,
                      country: selectedCountry,
                    }))
                  }}
                >
                  {location &&
                    location.conutries &&
                    location.conutries.map((item, index) => (
                      <Option key={index} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">State: </label>
                <Select
                  showSearch
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={true}
                  value={userDetails.state}
                  className="w-100"
                  onChange={(state) => {
                    const selectedState = location.states.find(
                      (el) => el.name === state,
                    )
                    setLocation((prev) => ({
                      ...prev,
                      cities: City.getCitiesOfState(
                        selectedState.countryCode,
                        selectedState.isoCode,
                      ),
                    }))
                    setUserDetails((prev) => ({
                      ...prev,
                      state: selectedState,
                    }))
                  }}
                >
                  {location &&
                    location.states &&
                    location.states.map((item, index) => (
                      <Option key={index} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">City: </label>
                <Select
                  showSearch
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={true}
                  className="w-100"
                  value={userDetails.city}
                  onChange={(city) => {
                    setUserDetails((prev) => ({
                      ...prev,
                      city: city,
                    }))
                  }}
                >
                  {location &&
                    location.cities &&
                    location.cities.map((item, index) => (
                      <Option key={index} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Phone Number: </label>
                <ReactPhoneInput
                  inputExtraProps={{
                    name: 'phone_number',
                    required: true,
                    autoFocus: true,
                  }}
                  value={userDetails.phone_number}
                  onChange={(phone_number) => {
                    setUserDetails((prev) => ({ ...prev, phone_number }))
                  }}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Gender: </label>
                <Select
                  showSearch
                  defaultActiveFirstOption={false}
                  // style={{ width: 300, marginTop: 30, marginLeft: 20 }}
                  showArrow={false}
                  filterOption={true}
                  className="w-100"
                  value={userDetails.gender}
                  onChange={(gender) => {
                    setUserDetails((prev) => ({ ...prev, gender }))
                  }}
                >
                  <Option value={'male'}>Male</Option>
                  <Option value={'female'}>Female</Option>
                  <Option value={'other'}>Other</Option>
                </Select>
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Rating: </label>
                <InputNumber
                  type="number"
                  value={userDetails.rating}
                  className="w-100"
                  name="rating"
                  min={0}
                  // onKeyDown={(e) => {
                  //   if (typeof e.key !== 'number') e.preventDefault()
                  //   else
                  //     setUserDetails((prev) => ({
                  //       ...prev.birth_day,
                  //       rating: e,
                  //     }))
                  // }}
                  onChange={(e) => {
                    e.target.value
                    if (typeof e.key !== 'number') e.preventDefault()
                    else
                      setUserDetails((prev) => ({
                        ...prev.birth_day,
                        rating: e,
                      }))
                  }}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Occupation: </label>
                <Select
                  showSearch
                  defaultActiveFirstOption={false}
                  // style={{ width: 300, marginTop: 30, marginLeft: 20 }}
                  showArrow={false}
                  filterOption={true}
                  className="w-100"
                  value={userDetails.occupation}
                  onChange={(occ, option) => {
                    console.log({ option })
                    setUserDetails((prev) => ({ ...prev, occupation: occ }))
                  }}
                >
                  {occupations &&
                    occupations.map((item, index) => (
                      <Option key={item.id} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Main Language: </label>
                <Select
                  showSearch
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={true}
                  value={userDetails.main_language}
                  className="w-100"
                  onChange={(language) => {
                    setUserDetails((prev) => ({
                      ...prev,
                      main_language: language,
                    }))
                  }}
                >
                  {languages &&
                    languages.map((item, index) => (
                      <Option key={item._id} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </div>
              <div className="col-12 d-flex justify-content-between align-items-center flex-wrap">
                <Link to={'/users'}>
                  <button
                    className={`btn btn-sm btn-primary mt-3`}
                    type="button"
                  >
                    Back
                  </button>
                </Link>
                <button className={`btn btn-sm btn-success mt-3`} type="submit">
                  Update
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default UpdateUser
