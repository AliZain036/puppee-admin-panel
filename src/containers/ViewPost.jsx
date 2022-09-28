import { Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import SwalAutoHide from 'sweetalert2'
import { addUpdateData, getAllData, uploadSingleFile } from '../backend/utility'
const { Option } = Select

const ViewPost = ({ props }) => {
  const urlPathName = window.location.pathname.split('/')
  const postId = urlPathName[urlPathName.length - 1]
  const [postDetails, setPostDetails] = useState({
    number_of_Comments: 3,
    numberOfDisLikes: 2,
    whoDisLikes: [
      {
        userId: '62e2e2a8547a71b7dfcabdb1',
      },
      {
        userId: '62d72ed4d5520644ac7851d7',
      },
    ],
    numberOfLikes: 1,
    whoLikes: [
      {
        userId: '62eef00cd860c3fa9444a54b',
      },
    ],
    post_videos: [],
    post_images: [
      {
        image_url:
          'https://pupeee.s3.ap-south-1.amazonaws.com/1659039435652image.jpg',
        image_text: 'image text',
        reviews: [],
        _id: '62e2eed1547a71b7dfcabf76',
      },
      {
        image_url:
          'https://pupeee.s3.ap-south-1.amazonaws.com/1659039438102image.jpg',
        image_text: 'image text',
        reviews: [],
        _id: '62e2eed1547a71b7dfcabf77',
      },
    ],
    tag_products: [
      {
        product_name: 'Lip Stick',
        affiliate_link: '',
        _id: '62e2eed1547a71b7dfcabf78',
      },
      {
        product_name: 'Shirt',
        affiliate_link: '',
        _id: '62e2eed1547a71b7dfcabf79',
      },
      {
        product_name: 'Trouser',
        affiliate_link: '',
        _id: '62e2eed1547a71b7dfcabf7a',
      },
    ],
    music: {
      author_name: '',
      description: '',
      _id: '62e2eed1547a71b7dfcabf74',
    },
    allow_comments: true,
    add_caption: 'bahahahajsiuwnw is\n',
    userId: '62e2e2a8547a71b7dfcabdb1',
    timestamp: '2022-07-28T20:17:21.493Z',
    __v: 8,
    my_list: [],
    privacy: {
      other: {
        radius: {
          lat: 123,
          lng: 321,
          address: 'asda',
          miles: 12,
        },
        local: true,
        cities_countries: true,
        global: true,
      },
      my_list: [
        {
          type: '14',
          selected: true,
          members: 15,
          _id: '62eeb3ead860c3fa944486ff',
        },
      ],
      hide_members_from: [
        {
          userId: '62d53e1859414430781fb6b0',
          first_name: 'first_name',
          last_name: 'last_name',
          user_name: 'user_name',
          profile_image_url: 'profile_image_url',
          _id: '62eeb3ead860c3fa94448700',
        },
      ],
      _id: '62eeb3ead860c3fa944486fe',
    },
    blocked: 'unblock',
  })
  useEffect(() => {
    getpostDetails()
  }, [])

  const getpostDetails = async () => {
    let result = await getAllData(`posts/${postId}`)
    if (result && result.success === true && result.statusCode === 200) {
      console.log(result.data)
      setPostDetails(result.data)
    }
  }

  const handleChange = (e) => {
    e.persist()
    setPostDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let body = {
      ...postDetails,
      userId: postDetails._id,
      seller_stripe_account_id: postDetails.seller_stripe_account_id || 'false',
    }
    body.rating = Number(postDetails.rating)
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
    // let body = {
    //   file: e.target.files[0],
    // }
    let formData = new FormData()
    formData.append('file', e.target.files[0])
    let result = await uploadSingleFile(formData)
    // const profile_image_url = URL.createObjectURL(e.target.files[0])
    if (result && result.success === true) {
      setPostDetails((prev) => ({ ...prev, profile_image_url }))
    }
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12 p-0">
        <h3>Update User Details</h3>
        {postDetails && (
          <form onSubmit={handleSubmit}>
            <div className="row">
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
                  src={postDetails.profile_image_url}
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
                  value={postDetails.first_name}
                  className="w-100"
                  name="first_name"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Last Name: </label>
                <input
                  type="text"
                  value={postDetails.last_name}
                  className="w-100"
                  name="last_name"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Email: </label>
                <input
                  type="text"
                  value={postDetails.email}
                  className="w-100"
                  name="email"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Country: </label>
                <input
                  type="text"
                  value={postDetails.country}
                  className="w-100"
                  name="country"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">City: </label>
                <input
                  type="text"
                  value={postDetails.city}
                  className="w-100"
                  name="city"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">State: </label>
                <input
                  type="text"
                  value={postDetails.state}
                  className="w-100"
                  name="state"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Phone Number: </label>
                <input
                  type="text"
                  value={postDetails.phone_number}
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
                    setPostDetails((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }}
                  value={postDetails.gender}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Rating: </label>
                <input
                  type="number"
                  value={postDetails.rating}
                  className="w-100"
                  name="rating"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Occupation: </label>
                <input
                  type="text"
                  value={postDetails.occupation}
                  className="w-100"
                  name="occupation"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="col-12 col-md-6 mt-2">
                <label className="m-0">Main Language: </label>
                <input
                  type="text"
                  value={postDetails.main_language}
                  className="w-100"
                  name="main_language"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              {/* <h5>Qualification Details: </h5> */}
              {/* {postDetails.} */}
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

export default ViewPost
