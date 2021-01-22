import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import moment from "moment";
import axios from "axios";
import { Pagination, Image } from "react-bootstrap";
import {
  connectFirebase,
  getAllOfCollection,
  getData,
} from "../backend/utility";
// import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
const token = Cookie.get("clobberswap_access_token");

export default class Posts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userPosts: [],
      chats: [],
      allUsers: [],
      activePage: 1,
      pages: 1,
      q: "",
      pageSize: 10,
      responseMessage: "Loading Users...",
      status: "Details",
      detailedUser: null,
      name: "",
      email: "",
      phoneNumber: "",
      followers: [],
      followings: [],
      blocked: [],
      transactions: [],
    };
  }

  getUserByID = (id) => {
    var myUser = "";
    this.state.allUsers.map((user) => {
      if (user.id === id) {
        myUser = user;
      }
    });
    return myUser;
  };

  getAllUserRelatedData = async () => {
    var followers = [];
    var followings = [];
    var transactions = [];
    var posts = [];
    var blocked = [];
    console.log("userId = ", this.props.match.params.userId);
    let allUsers = await getAllOfCollection("Users");
    this.setState({ allUsers: allUsers });
    var followerIds = "";
    var followingIds = "";
    var blockedIds = "";
    allUsers.map((user) => {
      if (user.id === this.props.match.params.userId) {
        console.log("this is detailed user", user);
        var expertise = "";
        user.expertise.map((ex, index) => {
          if (user.expertise[index + 1]) {
            expertise = expertise + ex.title + ", ";
          } else {
            expertise = expertise + ex.title;
          }
        });
        var languages = "";
        user.languages.map((ex, index) => {
          if (user.languages[index + 1]) {
            languages = languages + ex.title + ", ";
          } else {
            languages = languages + ex.title;
          }
        });
        user.languageString = languages;
        user.expertiseString = expertise;
        this.setState({ detailedUser: user });
        followerIds = user.followers;
        followingIds = user.followings;
        blockedIds = user.blocked;
      }
    });

    allUsers.map((user) => {
      followerIds.map((followerid) => {
        if (user.id === followerid) {
          followers.push(user);
        }
      });
    });

    allUsers.map((user) => {
      blockedIds.map((blockedID) => {
        if (user.id === blockedID) {
          blocked.push(user);
        }
      });
    });

    allUsers.map((user) => {
      followingIds.map((followingid) => {
        if (user.id === followingid) {
          followings.push(user);
        }
      });
    });
    this.setState({ followers: followers });
    this.setState({ followings: followings });
    this.setState({ blocked: blocked });
    // console.log("these are follower id", followers);
    // console.log("these are following id", followings);
    console.log("these are block id", blocked);
    let allTransactions = await getAllOfCollection("Transactions");
    let allPosts = await getAllOfCollection("Posts");
    allTransactions.map((trans) => {
      if (trans.creator === this.props.match.params.userId) {
        transactions.push(trans);
      }
    });

    allPosts.map((post) => {
      if (post.creator === this.props.match.params.userId) {
        posts.push(post);
      }
    });
    console.log("these are users posts", posts);
    this.setState({ userPosts: posts });
    this.setState({ transactions: transactions });
  };

  async componentWillMount() {
    connectFirebase();
    const { match, history } = this.props;
    this.getAllUserRelatedData();
  }

  async fetchUserDetail(id) {
    this.setState({
      loading: true,
      responseMessage: "Loading User Details...",
    });
    let userData = await getData("Users", id);
    // let userPosts = await getData("Posts", id);
    // let userChats = await getData("Chats", id);

    // if (userPosts) this.setState({ posts: userPosts });
    // if (userChats) this.setState({ chats: userChats });

    // console.log("user posts:", userPosts);

    this.setState({
      name: userData.userName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      loading: false,
    });
  }

  fetchOrders = async () => {
    axios.get(`${API_END_POINT}/api/show-all-posts`).then((response) => {
      this.setState({
        posts: response.data.posts,
        responseMessage: "No Users Found...",
      });
    });
  };

  fetchPastOrders = async (id) => {
    // let userPosts = await getData("Posts", id);
    let userChats = await getData("Chats", id);
    let AllchatArray = Object.keys(userChats);
    // if (userPosts) this.setState({ posts: userPosts });
    // if (userChats) this.setState({ chats: userChats });
    // axios.get(`${API_END_POINT}/api/show-active-posts`).then((response) => {
    this.setState({
      chats: AllchatArray,
      userChats: userChats,
      responseMessage: "No Users Found...",
    });
    // });
  };

  fetchRequestOrders = async (id) => {
    let userPosts = await getData("Posts", id);
    // let userChats = await getData("Chats", id);

    // if (userPosts) this.setState({ posts: userPosts });
    // if (userChats) this.setState({ chats: userChats });
    // axios.get(`${API_END_POINT}/api/show-sold-posts`).then((response) => {
    this.setState({
      posts: userPosts,
      responseMessage: "No Users Found...",
    });
    // });
  };

  fetchActiveOrders = () => {
    // axios.get(`${API_END_POINT}/api/show-block-posts`).then((response) => {
    //   this.setState({
    //     posts: response.data.posts,
    //     responseMessage: "No Posts Found...",
    //   });
    // });
  };

  getParams() {
    const { activePage, pageSize, userData, userChats } = this.state;
    return {
      params: {
        pageNumber: activePage,
        pageSize,
      },
    };
  }

  deleteOrders(dayId, index) {
    var data = { post_id: dayId };
    if (confirm("Are you sure you want to delete this user?")) {
      axios
        .post(`${API_END_POINT}/api/delete-post`, data)
        .then((response) => {
          if (response.status === 200 && response.data.status) {
            window.alert("User deleted succesfully  ");
          }

          const posts = this.state.posts.slice();
          posts.splice(index, 1);
          this.setState({ posts });
        })
        .catch((error) => {
          window.alert("ERROR !");
        });
    }
  }

  handleSelect(page) {
    this.setState({ activePage: page }, () => {
      axios
        .get(`${API_END_POINT}/api/fetch/locations-fetch`, this.getParams())
        // axios.get(`https://api.saaditrips.com/api/fetch/locations-fetch`, this.getParams())
        .then((response) => {
          this.setState({
            posts: response.data.items,
            activePage: page,
          });
        });
    });
  }

  handleSearch() {
    const { q } = this.state;
    var data = new FormData();
    data.append("query", q);
    if (q.length) {
      this.setState({
        loading: true,
        posts: [],
        responseMessage: "Loading Users...",
      });
      // if(q === "") {
      //   this.fetchOrders();
      // } else {
      axios.post(`${API_END_POINT}/api/search-post`, data).then((response) => {
        this.setState({
          posts: response.data.posts,
          loading: false,
          responseMessage: "No Users Found...",
        });
      });
    }
  }

  tabChangeHandler = (value) => {
    const { match } = this.props;

    if (this.state.status !== value) {
      this.setState({
        status: value,
        loading: true,
        responseMessage: "Loading Users...",
      });
      if (value === "Details") {
        this.fetchOrders();
      } else if (value === "Referals") {
        this.fetchPastOrders(match.params.userId);
      } else if (value === "Posts") {
        this.fetchRequestOrders(match.params.userId);
      } else if (value === "active") {
        this.fetchActiveOrders();
      }
    }
  };

  blockPostHandler = (postId) => {
    this.setState({ loading: true });
    const reqBody = {
      post_id: postId,
    };
    axios
      .post(`${API_END_POINT}/api/block-post`, reqBody)
      .then((response) => {
        this.fetchOrders();
      })
      .catch((err) => {
        alert("Some error occured...");
      });
  };

  unblockPostHandler = (postId) => {
    this.setState({ loading: true });
    const reqBody = {
      post_id: postId,
    };
    axios
      .post(`${API_END_POINT}/api/unblock-post`, reqBody)
      .then((response) => {
        this.fetchOrders();
      })
      .catch((err) => {
        alert("Some error occured...");
      });
  };

  render() {
    const { status, name, email, phoneNumber, chats, posts } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>
                {this.state.detailedUser &&
                  this.state.detailedUser.firstname +
                    " " +
                    this.state.detailedUser.lastname +
                    "'s "}{" "}
                Details
              </h3>
            </div>
            {/* <div className="col-sm-4">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={this.handleInputChange}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      this.handleSearch();
                    }
                  }}
                />
                <span className="input-group-btn">
                  <button
                    type="button"
                    onClick={() => this.handleSearch()}
                    className="btn btn-info search-btn"
                  >
                    Search
                  </button>
                </span>
              </div>
            </div>
          */}
          </div>

          <div className="row justify-content-between">
            <div className="float-left col-sm-6 space-1">
              <button
                type="button"
                style={{
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${
                  status === "Details" ? "btn-primary" : ""
                } btn btn-default`}
                onClick={() => this.tabChangeHandler("Details")}
              >
                Details
              </button>

              <button
                type="button"
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${
                  status === "Chats" ? "btn-primary" : ""
                } btn btn-default`}
                onClick={() => this.tabChangeHandler("Referrals")}
              >
                Referrals
              </button>

              <button
                type="button"
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${
                  status === "Posts" ? "btn-primary" : ""
                } btn btn-default`}
                onClick={() => this.tabChangeHandler("Posts")}
              >
                Posts
              </button>
              <button
                type="button"
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${
                  status === "Followers" ? "btn-primary" : ""
                } btn btn-default`}
                onClick={() => this.tabChangeHandler("Followers")}
              >
                Followers
              </button>
              <button
                type="button"
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${
                  status === "Following" ? "btn-primary" : ""
                } btn btn-default`}
                onClick={() => this.tabChangeHandler("Following")}
              >
                Following
              </button>
              <button
                type="button"
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${
                  status === "Blocked" ? "btn-primary" : ""
                } btn btn-default`}
                onClick={() => this.tabChangeHandler("Blocked")}
              >
                Blocked
              </button>
            </div>
          </div>

          <div className="table-responsive">
            {this.state.status === "Details" &&
              this.state.detailedUser != null && (
                <div className="row animated fadeIn">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-md-12 col-sm-12">
                        <div className="x_panel">
                          <div className="x_content">
                            <br />
                            <form
                              id="demo-form2"
                              data-parsley-validate
                              className="form-horizontal form-label-left"
                              onSubmit={this.postBrand}
                            >
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Image
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <img
                                    src={
                                      this.state.detailedUser.photo
                                        ? this.state.detailedUser.photo
                                        : "data:image/jpeg;base64,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"
                                    }
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Full Name
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={
                                      this.state.detailedUser.firstname +
                                      "" +
                                      this.state.detailedUser.lastname
                                    }
                                    // onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  About
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={this.state.detailedUser.about}
                                    onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Phone Number
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={this.state.detailedUser.phone}
                                    onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Office
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={this.state.detailedUser.officeName}
                                    onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Area Of Expertise
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={
                                      this.state.detailedUser.expertiseString
                                    }
                                    onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Language
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={
                                      this.state.detailedUser.languageString
                                    }
                                    onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Email
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={this.state.detailedUser.email}
                                    onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Website
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={this.state.detailedUser.website}
                                    onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Profession
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={this.state.detailedUser.profession}
                                    onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Address
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={this.state.detailedUser.address}
                                    onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Latitude
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={
                                      this.state.detailedUser.location.latitude
                                    }
                                    onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="control-label col-md-3 col-sm-3">
                                  Longitude
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={
                                      this.state.detailedUser.location.longitude
                                    }
                                    onChange={this.handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="ln_solid" />
                              <div className="form-group row">
                                <div className="col-md-6 col-sm-6 offset-md-3">
                                  {/* <Button className="btn btn-success btn-lg">
                                    {" "}
                                    Submit
                                  </Button> */}
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {this.state.status === "Referrals" && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>Client Name</th>
                    <th>Property type</th>
                    <th>Referral sender</th>
                    <th>Referral receiver</th>
                    <th>Creation Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.transactions &&
                    this.state.transactions.map((trans, index) => {
                      var creator = this.getUserByID(trans.creator);
                      var receiver = this.getUserByID(trans.receiver);
                      return (
                        <tr>
                          <td>{index}</td>
                          <td>{trans.clientName}</td>
                          <td>{trans.propertyType}</td>
                          <td>
                            {creator &&
                              creator.firstname + " " + creator.lastname}
                          </td>
                          <td>
                            {receiver != "" ? (
                              <Link
                                style={{ color: "black" }}
                                to={`/userdetails/${trans.receiver}`}
                              >
                                {receiver.firstname + " " + receiver.lastname}
                              </Link>
                            ) : (
                              trans.receiver
                            )}
                          </td>
                          <td>
                            {moment(
                              new Date(Date.UTC(1970, 0, 1)).setUTCSeconds(
                                trans.createdAt.seconds
                              )
                            ).format("YYYY-MM-DD")}
                          </td>
                          <td>{trans.status}</td>
                          <td>
                            <Link to={`/referal/${trans.transaction_id}`}>
                              <button
                                // onClick={() =>
                                //   topic.status === "block"
                                //     ? this.unblockPostHandler(topic.id)
                                //     : this.blockPostHandler(topic.id)
                                // }
                                className={`btn btn-sm btn-success`}
                              >
                                View
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
            {this.state.status === "Posts" && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>Image </th>
                    <th>Description</th>
                    <th>Address</th>
                    <th>Date Posted</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.userPosts &&
                    this.state.userPosts.map((post, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>
                            {" "}
                            <img
                              src={post.photos[0]}
                              style={{ width: "50px", height: "50px" }}
                            />
                          </td>
                          <td>{post.caption}</td>

                          <td>{post.address}</td>
                          <td>
                            {moment(
                              new Date(Date.UTC(1970, 0, 1)).setUTCSeconds(
                                post.createdAt.seconds
                              )
                            ).format("YYYY-MM-DD")}
                          </td>
                          <td>
                            <button
                              // onClick={() =>
                              //   topic.status === "block"
                              //     ? this.unblockPostHandler(topic.id)
                              //     : this.blockPostHandler(topic.id)
                              // }
                              className={`btn btn-sm btn-danger`}
                            >
                              Block
                            </button>
                          </td>
                          <td>
                            <Link to={`/viewposts/${post.id}`}>
                              <button
                                // onClick={() =>
                                //   topic.status === "block"
                                //     ? this.unblockPostHandler(topic.id)
                                //     : this.blockPostHandler(topic.id)
                                // }
                                className={`btn btn-sm btn-success`}
                              >
                                View
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
            {this.state.status === "Followers" && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>Image</th>
                    {/* <th>Image</th> */}
                    <th>Name</th>
                    <th>Email</th>
                    <th>Profession</th>
                    <th>Office</th>
                    <th>Phone Number</th>
                    {/* <th>Date</th> */}
                  </tr>
                </thead>
                <tbody>
                  {this.state.followers &&
                    this.state.followers.map((follower, index) => {
                      if (follower.isDeleted != true) {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                style={{ height: "50px", width: "50px" }}
                                src={
                                  follower.photo
                                    ? follower.photo
                                    : "data:image/png;base64,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"
                                }
                              />
                            </td>
                            <td>
                              {follower.firstname + " " + follower.lastname}
                            </td>
                            <td>{follower.email}</td>
                            <td>Real Estate Agent</td>
                            <td>{follower.officeName}</td>
                            <td>{follower.phone}</td>
                            <td>
                              <button
                                // onClick={() =>
                                //   topic.status === "block"
                                //     ? this.unblockPostHandler(topic.id)
                                //     : this.blockPostHandler(topic.id)
                                // }
                                // onClick={
                                //   // this.handleBlockPress(item.blocked, item.userId)
                                // }
                                className={`btn btn-sm btn-danger`}
                              >
                                Block
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  // window.location.href = `/userdetails/${follower.id}`;
                                  this.props.history.push(
                                    `/userdetails/${follower.id}`
                                  );
                                  this.setState({ status: "Details" });
                                  this.getAllUserRelatedData();
                                }}
                                className={`btn btn-sm btn-success`}
                              >
                                View
                              </button>
                            </td>
                            <td>
                              <span
                                className="fa fa-trash"
                                aria-hidden="true"
                                style={{ cursor: "pointer" }}
                                // onClick={() => this.handleDeleteUser(index)}
                              ></span>
                            </td>
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </table>
            )}

            {this.state.status === "Following" && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>Image</th>
                    {/* <th>Image</th> */}
                    <th>Name</th>
                    <th>Email</th>
                    <th>Profession</th>
                    <th>Office</th>
                    <th>Phone Number</th>
                    {/* <th>Date</th> */}
                  </tr>
                </thead>
                <tbody>
                  {this.state.followings &&
                    this.state.followings.map((following, index) => {
                      if (following.isDeleted != true) {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                style={{ height: "50px", width: "50px" }}
                                src={
                                  following.photo
                                    ? following.photo
                                    : "data:image/png;base64,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"
                                }
                              />
                            </td>
                            <td>
                              {following.firstname + " " + following.lastname}
                            </td>
                            <td>{following.email}</td>
                            <td>Real Estate Agent</td>
                            <td>{following.officeName}</td>
                            <td>{following.phone}</td>
                            <td>
                              <button
                                // onClick={() =>
                                //   topic.status === "block"
                                //     ? this.unblockPostHandler(topic.id)
                                //     : this.blockPostHandler(topic.id)
                                // }
                                // onClick={
                                //   // this.handleBlockPress(item.blocked, item.userId)
                                // }
                                className={`btn btn-sm btn-danger`}
                              >
                                Block
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  // window.location.href = `/userdetails/${following.id}`;
                                  this.props.history.push(
                                    `/userdetails/${following.id}`
                                  );
                                  this.getAllUserRelatedData();
                                  this.setState({ status: "Details" });
                                }}
                                className={`btn btn-sm btn-success`}
                              >
                                View
                              </button>
                            </td>
                            <td>
                              <span
                                className="fa fa-trash"
                                aria-hidden="true"
                                style={{ cursor: "pointer" }}
                                // onClick={() => this.handleDeleteUser(index)}
                              ></span>
                            </td>
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </table>
            )}
            {this.state.status === "Blocked" && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>Image</th>
                    {/* <th>Image</th> */}
                    <th>Name</th>
                    <th>Email</th>
                    <th>Profession</th>
                    <th>Office</th>
                    <th>Phone Number</th>
                    {/* <th>Date</th> */}
                  </tr>
                </thead>
                <tbody>
                  {this.state.blocked &&
                    this.state.blocked.map((following, index) => {
                      if (following.isDeleted != true) {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                style={{ height: "50px", width: "50px" }}
                                src={
                                  following.photo
                                    ? following.photo
                                    : "data:image/png;base64,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"
                                }
                              />
                            </td>
                            <td>
                              {following.firstname + " " + following.lastname}
                            </td>
                            <td>{following.email}</td>
                            <td>Real Estate Agent</td>
                            <td>{following.officeName}</td>
                            <td>{following.phone}</td>
                            <td>
                              <button
                                // onClick={() =>
                                //   topic.status === "block"
                                //     ? this.unblockPostHandler(topic.id)
                                //     : this.blockPostHandler(topic.id)
                                // }
                                // onClick={
                                //   // this.handleBlockPress(item.blocked, item.userId)
                                // }
                                className={`btn btn-sm btn-danger`}
                              >
                                Block
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  // window.location.href = `/userdetails/${following.id}`;
                                  this.props.history.push(
                                    `/userdetails/${following.id}`
                                  );
                                  this.getAllUserRelatedData();
                                  this.setState({ status: "Details" });
                                }}
                                className={`btn btn-sm btn-success`}
                              >
                                View
                              </button>
                            </td>
                            <td>
                              <span
                                className="fa fa-trash"
                                aria-hidden="true"
                                style={{ cursor: "pointer" }}
                                // onClick={() => this.handleDeleteUser(index)}
                              ></span>
                            </td>
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }
}
