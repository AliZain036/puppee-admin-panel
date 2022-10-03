import { Input, Select } from 'antd'
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
    let formData = new FormData()
    formData.append('file', e.target.files[0])
    let result = await uploadSingleFile(formData)
    if (result && result.success === true) {
      setPostDetails((prev) => ({ ...prev, profile_image_url }))
    }
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12 p-0">
        <h3>Post Details</h3>
        {postDetails && (
          <div className="col-12 row">
            <div className="col-12 col-md-6">
              <label>Date</label>
              <Input
                readOnly
                value={new Date(postDetails.timestamp).toLocaleDateString()}
              />
            </div>
            <div className="col-12 col-md-6">
              <label>Number of Likes</label>
              <Input readOnly value={postDetails.numberOfLikes} />
            </div>
            <div className="col-12 col-md-6">
              <label>Number of Dislikes</label>
              <Input readOnly value={postDetails.numberOfDisLikes} />
            </div>
            <div className="col-12 col-md-6">
              <label>No of Comments</label>
              <Input readOnly value={postDetails.number_of_Comments} />
            </div>
            <div className="col-12">
              <label>Post Images</label>
            </div>
            <div className="col-12 row mt-3">
              {postDetails.post_images &&
                postDetails.post_images.map((item, index) => (
                  <div className="col-12 col-md-4">
                    <img
                      src={item.image_url}
                      alt=""
                      key={item._id}
                      width={'100%'}
                      height={'100%'}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              <div className="col-12 col-md-4"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewPost
