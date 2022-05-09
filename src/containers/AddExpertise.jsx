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

export default class AddExpertise extends React.Component {
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
    var Professions = [
      {
        name: "Real Estate Agent",
        id: 1,
        active: true,
      },
      {
        name: "Mortgage Specialist",
        id: 2,
        active: true,
      },
      {
        name: "Notary Public",
        id: 3,
        active: true,
      },
      {
        name: "Real Estate Lawyer",
        id: 4,
        active: true,
      },
      {
        name: "Property Inspector",
        id: 5,
        active: true,
      },
      {
        name: "Property Appraiser",
        id: 6,
        active: true,
      },
      {
        name: "Property Insurance Specialist",
        id: 7,
        active: true,
      },
      {
        name: "Organizer or Administrator",
        id: 8,
        active: true,
      },
    ];
    var AreaOfExpertise = [
      {
        profession: "Real Estate Agent",
        id: 1,
        active: true,
        name: "Residential",
      },
      {
        profession: "Real Estate Agent",
        id: 2,
        active: true,
        name: "Commercial",
      },
      {
        profession: "Real Estate Agent",
        id: 3,
        active: true,
        name: "Agricultural",
      },
      {
        profession: "Real Estate Agent",
        id: 4,
        active: true,
        name: "Rural Properties",
      },
      {
        profession: "Real Estate Agent",
        id: 5,
        active: true,
        name: "Investment",
      },
      {
        profession: "Real Estate Agent",
        id: 6,
        active: true,
        name: "Strata",
      },
      {
        profession: "Real Estate Agent",
        id: 7,
        active: true,
        name: "Property Management",
      },

      {
        profession: "Mortgage Specialist",
        id: 1,
        active: true,
        name: "Residential",
      },
      {
        profession: "Mortgage Specialist",
        id: 2,
        active: true,
        name: "Commercial",
      },
      {
        profession: "Mortgage Specialist",
        id: 3,
        active: true,
        name: "Agricultural",
      },
      {
        profession: "Mortgage Specialist",
        id: 4,
        active: true,
        name: "Rural Properties",
      },
      {
        profession: "Mortgage Specialist",
        id: 5,
        active: true,
        name: "Investment Properties",
      },
      {
        profession: "Mortgage Specialist",
        id: 6,
        active: true,
        name: "Strata Properties",
      },
      {
        profession: "Mortgage Specialist",
        id: 7,
        active: true,
        name: "New Immigrants",
      },
      {
        profession: "Mortgage Specialist",
        id: 8,
        active: true,
        name: "Foreign Buyers",
      },
      {
        profession: "Mortgage Specialist",
        id: 9,
        active: true,
        name: "New Construction",
      },
      {
        profession: "Mortgage Specialist",
        id: 10,
        active: true,
        name: "First Time Home Buyers",
      },
      {
        profession: "Mortgage Specialist",
        id: 11,
        active: true,
        name: "Unconventional Lending",
      },
      //Real Estate Lawyer
      {
        profession: "Real Estate Lawyer",
        id: 1,
        active: true,
        name: "Residential",
      },
      {
        profession: "Real Estate Lawyer",
        id: 1,
        active: true,
        name: "Commercial",
      },
      {
        profession: "Real Estate Lawyer",
        id: 1,
        active: true,
        name: "Estate Planning and Probate",
      },
      {
        profession: "Real Estate Lawyer",
        id: 1,
        active: true,
        name: "Corporate Services",
      },
      {
        profession: "Real Estate Lawyer",
        id: 1,
        active: true,
        name: "Land Use Planning",
      },
      {
        profession: "Real Estate Lawyer",
        id: 1,
        active: true,
        name: "Family Law",
      },
      {
        profession: "Real Estate Lawyer",
        id: 1,
        active: true,
        name: "Litigation",
      },
      {
        profession: "Real Estate Lawyer",
        id: 1,
        active: true,
        name: "Tax Compliance",
      },

      //Notary Public
      {
        profession: "Notary Public",
        id: 1,
        active: true,
        name: "Real Estate Transfers",
      },
      {
        profession: "Notary Public",
        id: 1,
        active: true,
        name: "Estate Planning",
      },
      {
        profession: "Notary Public",
        id: 1,
        active: true,
        name: "Power of Attorney",
      },
      {
        profession: "Notary Public",
        id: 1,
        active: true,
        name: "Notarization",
      },
    ];
    var realEstateAgent = [
      {
        title: "Residential",
      },
      {
        title: "Commercial",
      },
      {
        title: "Agricultural",
      },
      {
        title: "Rural Properties",
      },
      {
        title: "Investment",
      },
      {
        title: "Strata",
      },
      {
        title: "Property Management",
      },
    ];

    var mortgageLenders = [
      {
        title: "Residential",
      },
      {
        title: "Commercial",
      },
      {
        title: "Agricultural",
      },
      {
        title: "Rural Properties",
      },
      {
        title: "Investment Properties",
      },
      {
        title: "Strata Properties",
      },
      {
        title: "New Immigrants",
      },
      {
        title: "Foreign Buyers",
      },
      {
        title: "New Construction",
      },
      {
        title: "First Time Home Buyers",
      },
      {
        title: "Unconventional Lending",
      },
    ];
    var realEstateLawyers = [
      {
        title: "Residential",
      },
      {
        title: "Commercial",
      },
      {
        title: "Estate Planning and Probate",
      },
      {
        title: "Corporate Services",
      },
      {
        title: "Land Use Planning",
      },
      {
        title: "Family Law",
      },
      {
        title: "Litigation",
      },
      {
        title: "Tax Compliance",
      },
    ];
    var notaryPublic = [
      {
        title: "Real Estate Transfers",
      },
      {
        title: "Estate Planning",
      },
      {
        title: "Power of Attorney",
      },
      {
        title: "Notarization",
      },
    ];
    console.log("this is new data", array);

    // this funtion is dangerouse

    // await updateData(
    //   "Admin",
    //   //this docuent is to add professions
    //   "lW16IC5TtfA58gxARBOW",

    //   // "Mortgage Lenders",
    //   // "Notary Public",
    //   // "Real Estate Lawyer",
    //   // "Real Estate Agent",
    //   // "Professions",
    //   "AreaOfExpertise",
    //   // Professions
    //   AreaOfExpertise
    // )
    //   .then(() => {
    //     this.componentWillMount();
    //     SwalAutoHide.fire({
    //       icon: "success",
    //       timer: 2000,
    //       title: "Success.",
    //       showConfirmButton: false,
    //       text: "Expertise Updated Successfully",
    //     }).then(() => {
    //       window.location.href = "/expertise";
    //     });
    //   })
    //   .catch((e) => {
    //     SwalAutoHide.fire({
    //       icon: "error",
    //       timer: 2000,
    //       title: "Failed.",
    //       showConfirmButton: false,
    //       text: "Languages Updated Failed",
    //     });
    //   });

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
          text: "Expertise Updated Successfully",
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

  async addProfessionUsingArray() {
    console.log("This is state.", this.state.expertise);
    var tempCat = this.state.expertise;
    tempCat.push({
      name: this.state.newLanguage,
      active: true,
      profession: this.props.match.params.name,
      id: this.state.expertise.length,
    });
    console.log("This is new Category", tempCat);
    await updateData(
      "Admin",
      "lW16IC5TtfA58gxARBOW",
      "AreaOfExpertise",
      tempCat
    )
      .then(() => {
        this.componentWillMount();
        SwalAutoHide.fire({
          icon: "success",
          timer: 2000,
          title: "Success.",
          showConfirmButton: false,
          text: "Profession Added Successfully",
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
          text: "Professions Add Failed",
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
    console.log("THis is it", Admin);

    this.setState({
      expertise: Admin[1].AreaOfExpertise,
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
                          // console.log(
                          //   "this is new Language",
                          //   this.state.newLanguage
                          // );
                          // console.log(
                          //   "this all languages",
                          //   this.state.languages
                          // );
                          // this.state.expertise.push({
                          //   selected: false,
                          //   title: this.state.newLanguage,
                          // });
                          // this.updateDataUsingArray(this.state.expertise);
                          this.addProfessionUsingArray();
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
