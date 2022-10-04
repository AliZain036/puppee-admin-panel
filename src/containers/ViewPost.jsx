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
    number_of_Comments: '',
    numberOfDisLikes: '',
    whoDisLikes: [],
    numberOfLikes: '',
    whoLikes: [],
    post_videos: [],
    post_images: [],
    tag_products: [],
    music: {},
    allow_comments: '',
    add_caption: '',
    userId: '',
    timestamp: '',
    my_list: [],
    privacy: {},
    blocked: '',
  })
  useEffect(() => {
    getpostDetails()
}, [])

  const getpostDetails = async () => {
    let result = await getAllData(`posts/${postId}`)
    if (result && result.success === true && result.statusCode === 200) {
      console.log(result.data, ' ==== post-details')
      setPostDetails(result.data)
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
              <label>Caption</label>
              <Input readOnly value={postDetails.add_caption} />
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
              <h5>Post Music Details</h5>
            </div>
            <div className="col-12 col-md-6">
              <label>Author Name</label>
              <Input readOnly value={postDetails.music.author_name} />
            </div>
            <div className="col-12 col-md-6">
              <label>Description</label>
              <Input readOnly value={postDetails.music.description} />
            </div>
            {postDetails.tag_products && (
              <div className="col-12">
                <h5>Tag Products</h5>
              </div>
            )}
            {postDetails.tag_products &&
              postDetails.tag_products.map((item, index) => (
                <div className="col-12 col-md-6" key={item._id}>
                  <label>Product Name</label>
                  <Input
                    readOnly
                    value={item.product_name}
                  />
                </div>
              ))}
            <div className="col-12">
              <h5>Post Images</h5>
            </div>
            <div className="col-12 row mt-3">
              {postDetails.post_images &&
                postDetails.post_images.map((item, index) => (
                  <div className="col-12 col-md-4" key={item._id}>
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
        <div className='mt-3'>
          <Link to={'/posts'}>
            <button className='btn btn-primary'>Back</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ViewPost
