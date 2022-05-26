import React, { useEffect, useState } from 'react'
import { addUpdateData, getAllData, getDataById } from '../backend/utility'
import SwalAutoHide from 'sweetalert2'
import axios from 'axios'

const UpdatePost = (props) => {
    const [post, setPost] = useState(null)
    const [postToUpdate, setPostToUpdate] = useState({
        image: null,
        location: "",
        description: "",
        post_id: "",
        user_id: ""
    })
    
  useEffect(() => {
    getPost()
  }, [])

  const getPost = async () => {
    try {
      let { postId } = props.match.params
      let reqBody = {
        post_id: postId,
      }
      let response = await getDataById('show-post', reqBody)
      if (response.data !== null) {
        let post = response.data
        setPostToUpdate({ user_id: post.user_id, post_id: post.id, location: post.location, description: post.description })
      }
    } catch (error) {
      SwalAutoHide.fire({
        icon: 'error',
        timer: 2000,
        title: 'Failed.',
        showConfirmButton: false,
        text: 'Something went wrong!',
      })
    }
  }

  const selectedFileHandler = (e) => {
    setPostToUpdate({ ...postToUpdate, image: e.target.files[0] })
  }

  const handleChange = (e) => {
    if (e.target.value) {
      setPostToUpdate({ ...postToUpdate, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    try {
    e.preventDefault()
    let fd = new FormData()
    if(postToUpdate.image) {
      fd.append('image[]', postToUpdate.image)
    }
    fd.append('location', postToUpdate.location)
    fd.append('description', postToUpdate.description)
    fd.append('post_id', postToUpdate.post_id)
    fd.append('user_id', postToUpdate.user_id)
      axios
        .post(
          'https://network-desk-backend.herokuapp.com/api/update-post',
          fd,
        )
        .then((res) => {
          if (res.data != null) {
            SwalAutoHide.fire({
              icon: 'success',
              timer: 2000,
              title: 'Success.',
              showConfirmButton: false,
              text: 'Post updated successfully',
            })
            props.history.push('/posts')
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
        <h3>Update Post</h3>
      </div>
      <div className="col-6 col-xs-12">
        <div className="user-details-section">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-group">
              <label htmlFor="post-image">Post Image</label>
              <input
                type="file"
                accept="image/*"
                name="post-image"
                id="post-image"
                className="form-control"
                onChange={(e) => selectedFileHandler(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                name="location"
                required
                id="location"
                className="form-control"
                value={postToUpdate.location || ""}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Description</label>
              <input
                type="text"
                required
                name="description"
                id="description"
                className="form-control"
                value={postToUpdate.description || ""}
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

export default UpdatePost
