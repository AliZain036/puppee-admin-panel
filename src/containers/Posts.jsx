import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cookie from 'js-cookie'
import swal from 'sweetalert'
import SwalAutoHide from 'sweetalert2'
import {
  addUpdateData,
  deleteRecord,
  getAllData,
  searchData,
  updateRecord,
} from '../backend/utility'
import { connect } from 'react-redux'
import { Box, Tab, Tabs, Typography } from '@material-ui/core'
import Swal from 'sweetalert2'
// import { Tabs } from 'antd'
const Posts = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getAllPosts()
  }, [])

  const getAllPosts = async () => {
    let result = await getAllData('posts/all/62c0b0e28bda435977e9407d')
    if (result && result.success === true && result.data) {
      setPosts(result.data)
    }
  }

  // const handleChange = (event, newValue) => {
  //   setState((prev) => ({ ...prev, value: newValue }))
  // }

  const handlePostDelete = async (postId) => {
    let body = {
      postId,
    }
    let result = await deleteRecord('posts', body)
    if (
      result.data.success === true &&
      result.data.message === 'Posts Deleted'
    ) {
      Swal.fire({
        title: 'Post Deleted Successfully!',
        icon: 'success',
        timer: '2000',
      })
      getAllPosts()
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong, please try again.',
        icon: 'error',
        timer: '2000',
      })
    }
  }

  const togglePostBlock = async (post) => {
    let body = {
      postId: post._id,
      blocked: post.blocked === 'block' ? 'unblock' : 'block',
    }
    let result = await updateRecord('posts', body)
    if (result && result.success === true && result.data) {
      Swal.fire({
        title: `Post ${
          result.data.blocked === 'block' ? 'Blocked' : 'Unblocked'
        } Successfully`,
        icon: 'success',
        timer: 2000,
      })
      getAllPosts()
    }
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12 p-0">
        <div className="row space-1">
          <div className="col-12">
            <h3>List of Posts</h3>
          </div>
        </div>
        {posts.length > 0 && (
          <div className="table-responsive" style={{ height: '700px' }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  {/* <th>Sr. #</th> */}
                  <th>Date</th>
                  <th>Image</th>
                  {/* <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th> */}
                </tr>
              </thead>

              <tbody>
                {posts.length != 0 &&
                  posts.map((post, index) => {
                    return (
                      <tr key={post._id}>
                        {/* <td>{index + 1}</td> */}
                        <td>{new Date(post.timestamp).toLocaleDateString()}</td>
                        <td>
                          <img
                            style={{
                              height: '50px',
                              width: '50px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                            src={post.post_images[0].image_url}
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => togglePostBlock(post)}
                            className={`btn btn-sm btn-danger`}
                          >
                            {post && post.blocked === 'block'
                              ? 'Unblock'
                              : 'Block'}
                          </button>
                        </td>
                        <td>
                          <Link to={`/postdetails/${post._id}`}>
                            <button className={`btn btn-sm btn-success`}>
                              View
                            </button>
                          </Link>
                        </td>
                        <td>
                          <Link to={`/updatepost/${post._id}`}>
                            <button className={`btn btn-sm btn-success`}>
                              Update
                            </button>
                          </Link>
                        </td>

                        {post.isDeleted !== true && (
                          <td>
                            <span
                              className="fa fa-trash"
                              aria-hidden="true"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handlePostDelete(post._id)}
                            ></span>
                          </td>
                        )}
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Posts
