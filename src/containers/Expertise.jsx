import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pagination } from "react-bootstrap";
import moment from "moment";
import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
import SwalAutoHide from "sweetalert2";
import {
  connectFirebase,
  getAllOfCollection,
  getData,
  addToArray,
  updateData,
} from "../backend/utility";
import firebase from "firebase";
const token = Cookie.get("clobberswap_access_token");

import HasRole from "../hoc/HasRole";

export default class CoverBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      activePage: 1,
      pages: 1,
      q: "",
      responseMessage: "Loading Colors...",
      expertise: [],
      copyexpertise: [],
      Admin: [],
    };
  }
  async componentWillMount() {
    // console.log("This is token now", Cookie.get("token"));
    if (Cookie.get("token")) {
      var data = [];
      let Admin = await getAllOfCollection("Admin");
      // this.setState({ Admin: Admin[0] });
      // for (let key in Admin[0]) {
      //   if (key !== "languages" && key !== "companies") {
      //     Admin[0][key].map((row) => {
      //       data.push({
      //         title: row.title,
      //         seleted: false,
      //         category: key,
      //       });
      //     });
      //   }
      // }
      console.log("This is ithe data", Admin[1]);

      this.setState({
        expertise: Admin[1].AreaOfExpertise,
        copyexpertise: Admin[1].AreaOfExpertise,
      });
    } else {
      this.props.history.push("/login");
    }
  }

  async updateexpertise() {
    await addToArray(
      "Admin",
      "0qYmJUZhg0WLUATMjaohcgrsGs33",
      "expertise",
      this.state.expertise
    )
      .then(() => {
        this.componentWillMount();
        SwalAutoHide.fire({
          icon: "success",
          timer: 2000,
          title: "Success.",
          showConfirmButton: false,
          text: "expertise Updated Successfully",
        });
      })
      .catch(() => {
        alert("Something went wrong");
      });
  }

  async updateexpertiseUsingArray(array, category) {
    console.log("this is new data", array, category);
    await updateData("Admin", "0qYmJUZhg0WLUATMjaohcgrsGs33", category, array)
      .then(() => {
        this.componentWillMount();
        SwalAutoHide.fire({
          icon: "success",
          timer: 2000,
          title: "Success.",
          showConfirmButton: false,
          text: "Expertise Updated Successfully",
        });
      })
      .catch((e) => {
        console.log("This is error", e);
        alert("Something went wrong");
      });
  }

  fetchBanners = () => {
    axios
      .get(`${API_END_POINT}/api/show-colors`, {
        headers: { "auth-token": token },
      })
      .then((response) => {
        console.log(response);
        this.setState({
          brands: response.data.colors,
          pages: Math.ceil(response.data.colors.length / 10),
          responseMessage: "No Colors Found...",
        });
      });
  };

  // const requestParams = {
  //   "userId": userId,
  // }

  deleteBrand(brandId, index) {
    if (confirm("Are you sure you want to delete this item?")) {
      axios
        .post(`${API_END_POINT}/api/delete-color`, { color_id: brandId })
        .then((response) => {
          const brands = this.state.brands.slice();
          brands.splice(index, 1);
          this.setState({ brands });
        });
    }
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page - 1) * 10}`).then((response) => {
      this.setState({
        areas: response.data.items,
        activePage: page,
      });
    });
  }

  async FilterFn(text) {
    if (text !== "") {
      let newData = this.state.expertise.filter(function (item) {
        let itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        let textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({
        expertise: newData,
        isSearching: true,
      });
    } else {
      this.setState({
        expertise: this.state.copyexpertise,
        isSearching: false,
      });
    }
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({ q: event.target.value });
    this.FilterFn(event.target.value);
  };

  render() {
    const { events } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of expertise</h3>
            </div>
            <div className="col-sm-4">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  // onChange={(event) => this.setState({q: event.target.value})}
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

            <div className="col-sm-4 pull-right mobile-space">
              {/* <button type="button" className="btn btn-success">
                Add new Language
              </button> */}
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Name </th>
                  <th>Category </th>
                </tr>
              </thead>

              <tbody>
                {this.state.expertise &&
                  this.state.expertise.map((language, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>

                        <td>{language.name}</td>
                        <td>{language.profession}</td>

                        <td>
                          <button
                            onClick={() => {
                              let newData = this.state.Admin[
                                language.category
                              ].filter(function (item) {
                                let itemData = item.title
                                  ? item.title.toUpperCase()
                                  : "".toUpperCase();
                                let textData = language.title.toUpperCase();
                                return itemData.indexOf(textData) == -1;
                              });
                              console.log("This greate", newData);
                              this.updateexpertiseUsingArray(
                                newData,
                                language.category
                              );
                            }}
                            className={`btn btn-sm btn-danger`}
                          >
                            Delete
                            {/* {post.statusAdmin && post.statusAdmin === "Block"
                              ? "Unblock"
                              : "Block"} */}
                          </button>
                        </td>
                        <td>
                          {/* <button
                            onClick={() =>
                              (window.location.href = `/addExpertise/${language.title}`)
                            }
                            className={`btn btn-sm btn-success`}
                          >
                            Add
                          </button> */}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {/* <button
            onClick={() => this.updateexpertise()}
            className={`btn btn-sm btn-success`}
          >
            Save
          </button> */}
        </div>
      </div>
    );
  }
}
