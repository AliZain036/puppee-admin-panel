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
} from '../backend/utility'
import { connect } from 'react-redux'
import { Box, Tab, Tabs, Typography } from '@material-ui/core'
// import { Tabs } from 'antd'
const Users = () => {
  const [state, setState] = useState({
    users: [],
    copyUsers: [],
    user: {},
    searchQuery: '',
    value: 0,
  })

  useEffect(() => {
    getAllUsers()
  }, [])

  function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box className="pt-3">
            <div>{children}</div>
          </Box>
        )}
      </div>
    )
  }

  const getAllUsers = async () => {
    let allUsers = await getAllData('users')
    let user = JSON.parse(localStorage.getItem('user'))
    setState((prev) => ({
      ...prev,
      users: allUsers,
      copyUsers: allUsers,
      user,
    }))
  }

  // async toggleUserBlock(user) {
  //   let requestBody = {
  //     user_id: user.id,
  //   }
  //   let userBlockStatus
  //   if (user.status && user.status === 'active') {
  //     userBlockStatus = await addUpdateData('admin-block-user', requestBody)
  //   } else if (user.status && user.status === 'blocked') {
  //     userBlockStatus = await addUpdateData('admin-unblock-user', requestBody)
  //   }
  //   if (userBlockStatus) {
  //     SwalAutoHide.fire({
  //       icon: 'success',
  //       timer: 2000,
  //       title: 'Success.',
  //       showConfirmButton: false,
  //       text: userBlockStatus.message,
  //     })
  //     this.componentDidMount()
  //   }
  // }

  const handleChange = (event, newValue) => {
    setState((prev) => ({ ...prev, value: newValue }))
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12 p-0">
        <div className="row space-1">
          <div className="col-12">
            <h3>List of Users</h3>
          </div>
          {/* <div className="col-sm-4">
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                name="search"
                placeholder="Enter keyword"
                value={state.searchQuery}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
              />
              <span className="input-group-btn">
                <button
                  type="button"
                  // onClick={handleSearch}
                  className="btn btn-info search-btn"
                >
                  Search
                </button>
              </span>
            </div>
          </div> */}
        </div>
        <Tabs
          value={state.value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="All Users" />
          <Tab label="Browser" />
          <Tab label="Seller" />
          <Tab label="Service Provider" />
        </Tabs>
        <TabPanel value={state.value} index={0}>
          {state.users.length > 0 && (
            <div className="table-responsive" style={{ height: '500px' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    {/* <th>Sr. #</th> */}
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>

                <tbody>
                  {state.users.length != 0 &&
                    state.users.map((user, index) => {
                      return (
                        <tr key={user._id}>
                          {/* <td>{index + 1}</td> */}
                          <td>
                            <img
                              style={{
                                height: '50px',
                                width: '50px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                              src={user.cover_image}
                            />
                          </td>
                          <td>{user.first_name + ' ' + user.last_name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone_number}</td>

                          <td>
                            <button
                              // onClick={() => {
                              //   this.toggleUserBlock(user)
                              // }}
                              className={`btn btn-sm btn-danger`}
                            >
                              {user.status && user.status === 'active'
                                ? 'Block'
                                : 'Unblock'}
                            </button>
                          </td>
                          <td>
                            <Link to={`/userdetails/${user.id}`}>
                              <button className={`btn btn-sm btn-success`}>
                                View
                              </button>
                            </Link>
                          </td>
                          <td>
                            <Link to={`/updateUser/${user.id}`}>
                              <button className={`btn btn-sm btn-success`}>
                                Update
                              </button>
                            </Link>
                          </td>

                          {user.isDeleted !== true && (
                            <td>
                              <span
                                className="fa fa-trash"
                                aria-hidden="true"
                                style={{ cursor: 'pointer' }}
                                // onClick={() => {
                                //   swal({
                                //     title: 'Delete User?',
                                //     text:
                                //       "Are you sure, the user won't be able to use app again!",
                                //     icon: 'warning',
                                //     buttons: true,
                                //     dangerMode: true,
                                //   }).then(async (willDelete) => {
                                //     if (willDelete) {
                                //       this.deleteThisUser(user)
                                //     } else {
                                //       return
                                //     }
                                //   })
                                // }}
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
        </TabPanel>
        <TabPanel value={state.value} index={1}>
          {state.users.length === 0 && <h3>No users found.</h3>}
          {state.users.length > 0 && (
            <div className="table-responsive" style={{ height: '500px' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    {/* <th>Sr. #</th> */}
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>

                <tbody>
                  {state.users.length != 0 &&
                    state.users.map((user, index) => {
                      if (user.user_type === 'browser') {
                        return (
                          <tr key={user._id}>
                            {/* <td>{index + 1}</td> */}
                            <td>
                              <img
                                style={{
                                  height: '50px',
                                  width: '50px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                }}
                                src={user.cover_image}
                              />
                            </td>
                            <td>{user.first_name + ' ' + user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone_number}</td>

                            <td>
                              <button
                                // onClick={() => {
                                //   this.toggleUserBlock(user)
                                // }}
                                className={`btn btn-sm btn-danger`}
                              >
                                {user.status && user.status === 'active'
                                  ? 'Block'
                                  : 'Unblock'}
                              </button>
                            </td>
                            <td>
                              <Link to={`/userdetails/${user.id}`}>
                                <button className={`btn btn-sm btn-success`}>
                                  View
                                </button>
                              </Link>
                            </td>
                            <td>
                              <Link to={`/updateUser/${user.id}`}>
                                <button className={`btn btn-sm btn-success`}>
                                  Update
                                </button>
                              </Link>
                            </td>

                            {user.isDeleted !== true && (
                              <td>
                                <span
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                  style={{ cursor: 'pointer' }}
                                  // onClick={() => {
                                  //   swal({
                                  //     title: 'Delete User?',
                                  //     text:
                                  //       "Are you sure, the user won't be able to use app again!",
                                  //     icon: 'warning',
                                  //     buttons: true,
                                  //     dangerMode: true,
                                  //   }).then(async (willDelete) => {
                                  //     if (willDelete) {
                                  //       this.deleteThisUser(user)
                                  //     } else {
                                  //       return
                                  //     }
                                  //   })
                                  // }}
                                ></span>
                              </td>
                            )}
                          </tr>
                        )
                      }
                    })}
                </tbody>
              </table>
            </div>
          )}
        </TabPanel>
        <TabPanel value={state.value} index={2}>
          {state.users.length === 0 && <h3>No users found.</h3>}
          {state.users.length > 0 && (
            <div className="table-responsive" style={{ height: '500px' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    {/* <th>Sr. #</th> */}
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>

                <tbody>
                  {state.users.length != 0 &&
                    state.users.map((user, index) => {
                      if (user.user_type === 'seller') {
                        return (
                          <tr key={user._id}>
                            {/* <td>{index + 1}</td> */}
                            <td>
                              <img
                                style={{
                                  height: '50px',
                                  width: '50px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                }}
                                src={user.cover_image}
                              />
                            </td>
                            <td>{user.first_name + ' ' + user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone_number}</td>

                            <td>
                              <button
                                // onClick={() => {
                                //   this.toggleUserBlock(user)
                                // }}
                                className={`btn btn-sm btn-danger`}
                              >
                                {user.status && user.status === 'active'
                                  ? 'Block'
                                  : 'Unblock'}
                              </button>
                            </td>
                            <td>
                              <Link to={`/userdetails/${user.id}`}>
                                <button className={`btn btn-sm btn-success`}>
                                  View
                                </button>
                              </Link>
                            </td>
                            <td>
                              <Link to={`/updateUser/${user.id}`}>
                                <button className={`btn btn-sm btn-success`}>
                                  Update
                                </button>
                              </Link>
                            </td>

                            {user.isDeleted !== true && (
                              <td>
                                <span
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                  style={{ cursor: 'pointer' }}
                                  // onClick={() => {
                                  //   swal({
                                  //     title: 'Delete User?',
                                  //     text:
                                  //       "Are you sure, the user won't be able to use app again!",
                                  //     icon: 'warning',
                                  //     buttons: true,
                                  //     dangerMode: true,
                                  //   }).then(async (willDelete) => {
                                  //     if (willDelete) {
                                  //       this.deleteThisUser(user)
                                  //     } else {
                                  //       return
                                  //     }
                                  //   })
                                  // }}
                                ></span>
                              </td>
                            )}
                          </tr>
                        )
                      }
                    })}
                </tbody>
              </table>
            </div>
          )}
        </TabPanel>
        <TabPanel value={state.value} index={3}>
          {state.users.length === 0 && <h3>No users found.</h3>}
          {state.users.length > 0 && (
            <div className="table-responsive" style={{ height: '500px' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    {/* <th>Sr. #</th> */}
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>

                <tbody>
                  {state.users.length != 0 &&
                    state.users.map((user, index) => {
                      if (user.user_type === 'service_provider') {
                        return (
                          <tr key={user._id}>
                            {/* <td>{index + 1}</td> */}
                            <td>
                              <img
                                style={{
                                  height: '50px',
                                  width: '50px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                }}
                                src={user.cover_image}
                              />
                            </td>
                            <td>{user.first_name + ' ' + user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone_number}</td>

                            <td>
                              <button
                                // onClick={() => {
                                //   this.toggleUserBlock(user)
                                // }}
                                className={`btn btn-sm btn-danger`}
                              >
                                {user.status && user.status === 'active'
                                  ? 'Block'
                                  : 'Unblock'}
                              </button>
                            </td>
                            <td>
                              <Link to={`/userdetails/${user.id}`}>
                                <button className={`btn btn-sm btn-success`}>
                                  View
                                </button>
                              </Link>
                            </td>
                            <td>
                              <Link to={`/updateUser/${user.id}`}>
                                <button className={`btn btn-sm btn-success`}>
                                  Update
                                </button>
                              </Link>
                            </td>

                            {user.isDeleted !== true && (
                              <td>
                                <span
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                  style={{ cursor: 'pointer' }}
                                  // onClick={() => {
                                  //   swal({
                                  //     title: 'Delete User?',
                                  //     text:
                                  //       "Are you sure, the user won't be able to use app again!",
                                  //     icon: 'warning',
                                  //     buttons: true,
                                  //     dangerMode: true,
                                  //   }).then(async (willDelete) => {
                                  //     if (willDelete) {
                                  //       this.deleteThisUser(user)
                                  //     } else {
                                  //       return
                                  //     }
                                  //   })
                                  // }}
                                ></span>
                              </td>
                            )}
                          </tr>
                        )
                      }
                    })}
                </tbody>
              </table>
            </div>
          )}
        </TabPanel>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const user = state.user.user || {}
  return {
    currentUserId: user.id,
    currentUser: user,
  }
}

export default connect(mapStateToProps)(Users)
