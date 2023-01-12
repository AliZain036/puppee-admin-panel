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
import { Input, Select } from 'antd'
// import { Tabs } from 'antd'
const Posts = () => {
  const [posts, setPosts] = useState([])
  const [tempPosts, setTempPosts] = useState([])
  const [userCurrentTimeZone, setUserCurrentTimeZone] = useState()
  const [searchQuery, setSearchQuery] = useState('')
  const postFilterByDurationOptions = [
    {
      label: 'All time',
      value: 0,
    },
    {
      label: '1 Year Older',
      value: 1,
    },
    {
      label: '2 Years Older',
      value: 2,
    },
    {
      label: '3 Years Older',
      value: 3,
    },
    {
      label: '4 Years Older',
      value: 4,
    },
    {
      label: '5 Years Older',
      value: 5,
    },
  ]
  const [selectedFilterValue, setSelectedFilterValue] = useState(
    postFilterByDurationOptions[0].value,
  )

  useEffect(() => {
    getAllPosts()
    const timezone = Intl.DateTimeFormat().resolvedOptions()
    setUserCurrentTimeZone(timezone)
  }, [])

  const getAllPosts = async () => {
    let result = await getAllData('posts/all/62c0b0e28bda435977e9407d')
    if (result && result.success === true && result.data) {
      setPosts(result.data)
      setTempPosts(result.data)
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

  const getLocaleTimeZone = (timestamp) => {
    // const tzid = Intl.DateTimeFormat().resolvedOptions().timeZone
    return new Date(timestamp).toLocaleDateString(userCurrentTimeZone.locale, {
      timeZone: userCurrentTimeZone.timeZone,
    })
  }

  const handleUserSearch = () => {
    let posts = [...tempPosts]
    setPosts(posts)
    if (searchQuery) {
      posts = posts.filter(
        (post) =>
          post.userId &&
          post.userId.user_name &&
          post.userId.user_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
      setPosts(posts)
    } else {
      setPosts(tempPosts)
    }
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12 p-0">
        <div className="row space-1">
          <div className="col-12">
            <Input
              type="text"
              inputMode="search"
              className="mb-3"
              value={searchQuery}
              placeholder="Search by username"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUserSearch()
                }
              }}
            />
          </div>
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center my-3">
              <h3 className="m-0">List of Posts</h3>
              <div className="d-flex align-items-center">
                <label className="m-0">Filter posts by duration</label>
                <Select
                  showSearch
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={true}
                  value={selectedFilterValue}
                  className="w-100"
                  onChange={(e) => {
                    setSelectedFilterValue(e)
                    if(e !== 0) {
                      let filterdPosts = posts.map((post) => {
                        if (e !== 0) {
                          let filterDate = new Date()
                          filterDate.setFullYear(filterDate.getFullYear() - e)
                          if (new Date(post.timestamp) >= filterDate) {
                            return post
                          }
                        }
                      })
                      setPosts(filterdPosts)
                    } else {
                      setPosts(posts)
                    }
                  }}
                >
                  {postFilterByDurationOptions &&
                    postFilterByDurationOptions.map((item, index) => (
                      <Select.Option key={index} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
        {posts.length > 0 && (
          <div className="table-responsive" style={{ height: '700px' }}>
            <table className="table table-striped">
              <thead style={{position:"relative"}}>
                <tr style={{position:"sticky",top:0,background:"white",zIndex:10}}>
                  {/* <th>Sr. #</th> */}
                  <th>Date</th>
                  <th>Username</th>
                  <th>Image</th>
                    <th></th>
                    <th></th>
                    <th></th>

                </tr>
              </thead>

              <tbody>
                {posts.length != 0 &&
                  posts.map((post, index) => {
                    return (
                      <tr key={post._id}>
                        {/* <td>{index + 1}</td> */}
                        <td>{getLocaleTimeZone(post.timestamp)}</td>
                        <td>{post.userId && post.userId.user_name}</td>
                        {/* <td>{new Date(post.timestamp).toLocaleDateString()}</td> */}
                        <td>
                          <img
                            style={{
                              height: '50px',
                              width: '50px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                            src={post && post.post_images && (post.post_images).length>0 && post.post_images[0] && post.post_images[0].image_url}
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
                          <Link to={`/post-details/${post._id}`}>
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
