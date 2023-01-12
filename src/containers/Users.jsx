import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
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
import {connect} from 'react-redux'
import {Box, Tab, Tabs, Typography} from '@material-ui/core'
import Swal from 'sweetalert2'
import {Button, Checkbox, Input} from 'antd'

// import { Tabs } from 'antd'
const Users = () => {
    const [state, setState] = useState({
        users: [],
        copyUsers: [],
        user: {},
        searchQuery: '',
        value: 0,
    });

    const [search,setSearch]=useState("")


    useEffect(() => {
        getAllUsers();
    }, [])

    useEffect(() => {
        localStorage.setItem("user_type", state.value);
        const stringifyUsersList = localStorage.getItem("users_list");
        let jsonUsers = stringifyUsersList && JSON.parse(stringifyUsersList);
        jsonUsers.current = 0;
        localStorage.setItem("users_list", JSON.stringify(jsonUsers));

    }, [state.value])


    function TabPanel(props) {
        const {children, value, index, ...other} = props

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

    const [multipleUsersBlockStatus, setMultipleUsersBlockStatus] = useState([])


    const saveUsersToLocalStorage = (allUsers) => {
        localStorage.setItem("users_list", JSON.stringify(
            {users: getUserIds(allUsers), current: -1})
        )
    }

    const getAllUsers = async () => {
        let allUsers = await getAllData('users');
        let user = JSON.parse(localStorage.getItem('user'))
        saveUsersToLocalStorage(allUsers);
        setState((prev) => ({
            ...prev,
            users: allUsers,
            copyUsers: allUsers,
            user,
        }))
    }

    const handleDeleteUser = async (id) => {
        let result = await deleteRecord(`users/${id}`)
        if (
            result.data.success === true &&
            result.data.message === 'User Deleted'
        ) {
            Swal.fire({
                title: 'User Deleted Successfully!',
                icon: 'success',
                timer: '2000',
            })
            getAllUsers()
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                timer: '2000',
            })
        }
    }

    const handleChange = (event, newValue) => {
        setState((prev) => ({...prev, value: newValue}))
    }

    const handleUserBlock = async (user) => {
        let body = {
            userId: user._id,
            seller_stripe_account_id: user.seller_stripe_account_id || 'false',
            blocked: user.blocked === 'block' ? 'unblock' : 'block',
        }
        let result = await addUpdateData('users/profile', body)
        if (result && result.success === true && result.data) {
            Swal.fire({
                title: `User ${
                    result.data.blocked === 'block' ? 'Blocked' : 'Unblocked'
                    } Successfully`,
                icon: 'success',
                timer: 2000,
            })
            getAllUsers()
        }
    }

    const handleMultipleUsersBlockUpdate = async () => {
        let body = {
            users: multipleUsersBlockStatus,
        }
        let result = await updateRecord('users/profile/multiple', body)
        if (result.success === true) {
            Swal.fire({icon: 'success', title: 'Users updated successfully!', timer: 3000})
            getAllUsers()
        }
    }


    const getUserIds = (usersList) => {
        const users = (usersList).map((user) => ({id: user._id, user_type: user.user_type}));
        return users;
    }

    const handleMultipleBlocks = async (value, user) => {
        setState((prev) => ({
            ...prev,
            users: state.users.map((item, index) => {
                if (item._id === user._id) {
                    return {
                        ...item,
                        blocked: value,
                    }
                } else return item
            }),
        }))
        let tempUser = multipleUsersBlockStatus.find(
            (item) => item.userId == user._id,
        )
        if (!tempUser) {
            let item = {
                userId: user._id,
                blocked: value,
            }
            setMultipleUsersBlockStatus((prev) => [
                ...prev,
                {userId: user._id, blocked: value},
            ])
        } else if (tempUser) {
            setMultipleUsersBlockStatus((prev) =>
                prev.map((item, index) => {
                    if (item.userId === user._id) {
                        return {
                            userId: item.userId,
                            blocked: value,
                        }
                    } else return item
                }),
            )
        }
    }

    const handleSearch=()=>{
        let users=JSON.parse(JSON.stringify(state.copyUsers));
        if(search && search==="block"){
            users=users.filter((user)=>user.blocked==="block")
        }else if(search && search==="unblock"){
            users=users.filter((user)=>user.blocked==="unblock")
        }else if(search.length>0){
            users=users.filter((user)=>(user.first_name).toLowerCase().includes(search)
                || (user.last_name).includes(search) || (user.user_name).toLowerCase().includes(search));
        }

        setState({...state,users})
    }




    return (
        <div className="row animated fadeIn">

            <div className="col-12">
            <div className="text-end">
                <Input
                    allowClear
                    className="my-3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onPressEnter={() => handleSearch()}
                    placeholder="Enter title and press enter to search"
                />
            </div>
            </div>
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
                    <Tab label="All Users"/>
                    <Tab label="Browser"/>
                    <Tab label="Seller"/>
                    <Tab label="Service Provider"/>

                </Tabs>
                <TabPanel value={state.value} index={0}>
                    {state.users && (
                        <div className="table-responsive" style={{height: '700px'}}>
                            <table className="table table-striped">
                                <thead style={{position:"relative"}}>
                                <tr style={{position:"sticky",top:0,background:"white",zIndex:10}}>
                                    {/* <th>Sr. #</th> */}
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Phone</th>
                                    <th>Unblock</th>
                                    <th>Block</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th>
                                        <Button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={handleMultipleUsersBlockUpdate}
                                        >
                                            Update
                                        </Button>
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {state.users &&
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
                                                    src={user.profile_image_url}
                                                />
                                            </td>
                                            <td>{user.first_name + ' ' + user.last_name}</td>
                                            <td>
                                                <p style={{
                                                    padding:user.user_type==="service_provider"?"10px 12px":"10px 15px",
                                                    borderRadius:"50%",
                                                    background:"#3EA662",
                                                    color:"white",
                                                    fontWeight:"bod"}}>
                                                    {user.user_type === 'browser' && "B"}
                                                    {user.user_type === 'seller' && "S"}
                                                    {user.user_type === 'service_provider' && "SP"}
                                                    {user.user_type === 'user' && "U"}

                                                </p>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>{user.user_name}</td>
                                            <td>{user.phone_number}</td>
                                            <td>
                                                <input
                                                    type="radio"
                                                    name={user._id}
                                                    value="unblock"
                                                    defaultChecked={user.blocked !== 'block'}
                                                    onChange={(e) =>
                                                        handleMultipleBlocks(e.target.value, user)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="radio"
                                                    name={user._id}
                                                    value="block"
                                                    defaultChecked={user.blocked === 'block'}
                                                    onChange={(e) =>
                                                        handleMultipleBlocks(e.target.value, user)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <Link to={`/userFeedback/${user._id}`}>
                                                    <button className={`btn btn-sm btn-success`}>
                                                        Feedback
                                                    </button>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to={`/userdetails/${user._id}`}>
                                                    <button className={`btn btn-sm btn-success`}>
                                                        View
                                                    </button>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to={`/updateUser/${user._id}`}>
                                                    <button className={`btn btn-sm btn-success`}>
                                                        Update
                                                    </button>
                                                </Link>
                                            </td>
                                            <td>
                            <span
                                className="fa fa-trash"
                                aria-hidden="true"
                                style={{cursor: 'pointer'}}
                                onClick={() => handleDeleteUser(user._id)}
                            ></span>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </TabPanel>
                <TabPanel value={state.value} index={1}>
                    {/* {state.users && <h3>No users found.</h3>} */}
                    {state.users && (
                        <div className="table-responsive" style={{height: '500px'}}>
                            <table className="table table-striped">
                                <thead style={{position:"relative"}}>
                                <tr style={{position:"sticky",top:0,background:"white",zIndex:10}}>
                                    {/* <th>Sr. #</th> */}
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Phone</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                </thead>

                                <tbody>
                                {state.users &&
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
                                                        src={user.cover_image || user.profile_image_url}
                                                    />
                                                </td>
                                                <td>{user.first_name + ' ' + user.last_name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.user_name}</td>
                                                <td>{'+' + user.phone_number}</td>

                                                <td>
                                                    <button
                                                        onClick={() => handleUserBlock(user)}
                                                        className={`btn btn-sm btn-danger`}
                                                    >
                                                        {user.blocked === 'block' ? 'Unblock' : 'Block'}
                                                    </button>
                                                </td>

                                                <td>
                                                    <Link to={`/userFeedback/${user._id}`}>
                                                        <button className={`btn btn-sm btn-success`}>
                                                            Feedback
                                                        </button>
                                                    </Link>
                                                </td>

                                                <td>
                                                    <Link to={`/userdetails/${user._id}`}>
                                                        <button className={`btn btn-sm btn-success`}>
                                                            View
                                                        </button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link to={`/updateUser/${user._id}`}>
                                                        <button className={`btn btn-sm btn-success`}>
                                                            Update
                                                        </button>
                                                    </Link>
                                                </td>

                                                <td>
                              <span
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                  style={{cursor: 'pointer'}}
                                  onClick={() => handleDeleteUser(user._id)}
                              ></span>
                                                </td>
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
                    {/* {state.users && <h3>No users found.</h3>} */}
                    {state.users && (
                        <div className="table-responsive" style={{height: '500px'}}>
                            <table className="table table-striped">
                                <thead style={{position:"relative"}}>
                                <tr style={{position:"sticky",top:0,background:"white",zIndex:10}}>
                                    {/* <th>Sr. #</th> */}
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Phone</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                </thead>

                                <tbody>
                                {state.users &&
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
                                                        src={user.cover_image || user.profile_image_url}
                                                    />
                                                </td>
                                                <td>{user.first_name + ' ' + user.last_name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.user_name}</td>
                                                <td>{user.phone_number}</td>

                                                <td>
                                                    <button
                                                        onClick={() => handleUserBlock(user)}
                                                        className={`btn btn-sm btn-danger`}
                                                    >
                                                        {user.blocked === 'block' ? 'Unblock' : 'Block'}
                                                    </button>
                                                </td>

                                                <td>
                                                    <Link to={`/userFeedback/${user._id}`}>
                                                        <button className={`btn btn-sm btn-success`}>
                                                            Feedback
                                                        </button>
                                                    </Link>
                                                </td>

                                                <td>
                                                    <Link to={`/userdetails/${user._id}`}>
                                                        <button className={`btn btn-sm btn-success`}>
                                                            View
                                                        </button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link to={`/updateUser/${user._id}`}>
                                                        <button className={`btn btn-sm btn-success`}>
                                                            Update
                                                        </button>
                                                    </Link>
                                                </td>

                                                <td>
                              <span
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                  style={{cursor: 'pointer'}}
                                  onClick={() => handleDeleteUser(user._id)}
                              ></span>
                                                </td>
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
                    {/* {state.users && <h3>No users found.</h3>} */}
                    {state.users && (
                        <div className="table-responsive" style={{height: '500px'}}>
                            <table className="table table-striped">
                                <thead style={{position:"relative"}}>
                                <tr style={{position:"sticky",top:0,background:"white",zIndex:10}}>
                                    {/* <th>Sr. #</th> */}
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Phone</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>

                                </tr>
                                </thead>

                                <tbody>
                                {state.users &&
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
                                                        src={user.cover_image || user.profile_image_url}
                                                    />
                                                </td>
                                                <td>{user.first_name + ' ' + user.last_name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.user_name}</td>
                                                <td>{user.phone_number}</td>

                                                <td>
                                                    <button
                                                        onClick={() => handleUserBlock(user)}
                                                        className={`btn btn-sm btn-danger`}
                                                    >
                                                        {user.blocked === 'block' ? 'Unblock' : 'Block'}
                                                    </button>
                                                </td>

                                                <td>
                                                    <Link to={`/userFeedback/${user._id}`}>
                                                        <button className={`btn btn-sm btn-success`}>
                                                            Feedback
                                                        </button>
                                                    </Link>
                                                </td>

                                                <td>
                                                    <Link to={`/userdetails/${user._id}`}>
                                                        <button className={`btn btn-sm btn-success`}>
                                                            View
                                                        </button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link to={`/updateUser/${user._id}`}>
                                                        <button className={`btn btn-sm btn-success`}>
                                                            Update
                                                        </button>
                                                    </Link>
                                                </td>

                                                <td>
                              <span
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                  style={{cursor: 'pointer'}}
                                  onClick={() => handleDeleteUser(user._id)}
                              ></span>
                                                </td>
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
