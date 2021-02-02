import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import axios from "axios";
import SwalAutoHide from "sweetalert2";
import {
  connectFirebase,
  getAllOfCollection,
  getData,
  updateData,
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
      newLanguage: "",
      languages: [],
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

  async updateLanguagesUsingArray(array) {
    console.log("this is new data", array);
    await updateData(
      "Admin",
      "0qYmJUZhg0WLUATMjaohcgrsGs33",
      "companies",
      array
    )
      .then(() => {
        this.componentWillMount();
        SwalAutoHide.fire({
          icon: "success",
          timer: 2000,
          title: "Success.",
          showConfirmButton: false,
          text: "Companies Updated Successfully",
        }).then(() => {
          window.location.href = "/companies";
        });
      })
      .catch((e) => {
        SwalAutoHide.fire({
          icon: "error",
          timer: 2000,
          title: "Failed.",
          showConfirmButton: false,
          text: "Companies Update Failed",
        });
      });
  }

  getAllUserRelatedData = async () => {
    console.log("userId = ", this.props.match.params.userId);
    let allUsers = await getAllOfCollection("Users");
    console.log("THis is user", allUsers);
  };

  async componentWillMount() {
    let Admin = await getAllOfCollection("Admin");
    // this.setState({ userPosts: allPosts, copyPosts: allPosts });
    console.log("This is the admin", Admin[0].companies);
    this.setState({
      languages: Admin[0].companies,
    });
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
              <h3>Add New Company</h3>
            </div>
          </div>

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
                        onSubmit={(e) => {
                          e.preventDefault();
                          console.log(
                            "this is new Language",
                            this.state.newLanguage
                          );
                          console.log(
                            "this all languages",
                            this.state.languages
                          );
                          var newArray = this.state.languages.push({
                            selected: false,
                            title: this.state.newLanguage,
                          });
                          console.log(
                            "this all languages after",
                            this.state.languages
                          );
                          console.log("THis is new array", newArray);
                          this.updateLanguagesUsingArray(this.state.languages);
                        }}
                      >
                        <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">
                            Name
                          </label>
                          <div className="col-md-8 col-sm-8">
                            <div className="col-md-8 col-sm-8">
                              <input
                                required
                                type="text"
                                name="name"
                                placeholder="Add Company"
                                className="form-control"
                                value={this.state.newLanguage}
                                onChange={(e) => {
                                  this.setState({
                                    newLanguage: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-1 col-sm-1">
                            <Button className="btn btn-success btn-md">
                              {" "}
                              Submit
                            </Button>
                          </div>
                        </div>
                        <div className="ln_solid" />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
