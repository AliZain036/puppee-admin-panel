import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import axios from "axios";
import Select from "react-select";
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
      categories: [],
      options: [],
      expertise: [],
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

  async updateDataUsingArray(array) {
    console.log("this is new data", array);
    await updateData(
      "Admin",
      "0qYmJUZhg0WLUATMjaohcgrsGs33",
      this.props.match.params.name,
      array
    )
      .then(() => {
        this.componentWillMount();
        SwalAutoHide.fire({
          icon: "success",
          timer: 2000,
          title: "Success.",
          showConfirmButton: false,
          text: "Languages Updated Successfully",
        }).then(() => {
          window.location.href = "/expertise";
        });
      })
      .catch((e) => {
        SwalAutoHide.fire({
          icon: "error",
          timer: 2000,
          title: "Failed.",
          showConfirmButton: false,
          text: "Languages Updated Failed",
        });
      });
  }

  getAllUserRelatedData = async () => {
    console.log("userId = ", this.props.match.params.userId);
    let allUsers = await getAllOfCollection("Users");
    console.log("THis is user", allUsers);
  };

  async componentWillMount() {
    var cats = [];
    let Admin = await getAllOfCollection("Admin");
    console.log("THis is it", Admin[0][this.props.match.params.name]);
    // this.setState({
    //   expertise: Admin[0].expertise,
    //   copyexpertise: Admin[0].expertise,
    // });
    for (let key in Admin[0]) {
      if (key !== "languages" && key !== "companies") {
        var Option = { value: key, label: key };
        cats.push(Option);
        // if (key === this.props.match.params.name) {
        //   this.setState({
        //     expertise: A,
        //   });
        // }
      }
    }
    this.setState({
      expertise: Admin[0][this.props.match.params.name],
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

  render() {
    const { status, name, email, phoneNumber, chats, posts } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Add New Entry to {this.props.match.params.name}</h3>
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
                          this.state.expertise.push({
                            selected: false,
                            title: this.state.newLanguage,
                          });
                          this.updateDataUsingArray(this.state.expertise);
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
                                placeholder="Add Expertise"
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
