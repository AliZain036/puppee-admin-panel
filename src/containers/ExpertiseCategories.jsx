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
  getDataWithDoc,
  updateData,
  addToArray,
  deleteData,
  getAllData,
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
      categories: [],
      copyCategories: [],
    };
  }
  async componentWillMount() {
    // console.log("This is token now", Cookie.get("token"));
    if (Cookie.get("token")) {
      var cats = [];
      // let Admin = await getAllOfCollection("Admin");
      let categories = await getAllData("show-categories");
      debugger;
      // let TestAdmin = await getDataWithDoc("Admin","")
      // this.setState({ userPosts: allPosts, copyPosts: allPosts });
      // console.log("This is the admin", Admin[1]);
      // for (let key in Admin[0]) {
      //   if (key !== "languages" && key !== "companies") {
      //     cats.push(key);
      //   }
      // }
      this.setState({
        categories: categories.data,
        // copyCategories: Admin[1].Professions,
      });
    } else {
      this.props.history.push("/login");
    }
  }

  async deleteExpertiseUsingArray(category) {
    console.log("This is category", category);
    var tempCat = [];
    this.state.categories.map((cat) => {
      if (cat.name != category.name) {
        tempCat.push(cat);
      }
    });
    console.log("This is new Category", tempCat);
    await updateData("Admin", "lW16IC5TtfA58gxARBOW", "Professions", tempCat)
      .then(() => {
        this.componentWillMount();
        SwalAutoHide.fire({
          icon: "success",
          timer: 2000,
          title: "Success.",
          showConfirmButton: false,
          text: "Profession Deleted Successfully",
        }).then(() => {
          // window.location.reload();
        });
      })
      .catch((e) => {
        SwalAutoHide.fire({
          icon: "error",
          timer: 2000,
          title: "Failed.",
          showConfirmButton: false,
          text: "Professions Delete Failed",
        });
      });
  }

  async updateLanguages() {
    await addToArray(
      "Admin",
      "0qYmJUZhg0WLUATMjaohcgrsGs33",
      "languages",
      this.state.languages
    )
      .then(() => {
        SwalAutoHide.fire({
          icon: "success",
          timer: 3000,
          title: "Success.",
          showConfirmButton: false,
          text: "Languages Updated Successfully",
        }).then(() => {
          this.componentWillMount();
        });
      })
      .catch(() => {
        alert("Something went wrong");
      });
  }

  async deleteCategory(fieldName) {
    let allUsers = await deleteData(
      "Admin",
      "0qYmJUZhg0WLUATMjaohcgrsGs33",
      fieldName,
      []
    )
      .then((e) => {
        console.log("This is delted", e);
        SwalAutoHide.fire({
          icon: "success",
          timer: 2000,
          title: "Success.",
          showConfirmButton: false,
          text: "Terms and Conditions Updated Successfully",
        }).then(() => {
          this.componentWillMount();
        });
      })
      .catch((e) => {
        console.log("this is", e);
        SwalAutoHide.fire({
          icon: "error",
          timer: 2000,
          title: "Failure",
          showConfirmButton: false,
          text: "Something went wrong!!",
        });
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
      let newData = this.state.categories.filter(function (item) {
        let itemData = item ? item.name.toUpperCase() : "".toUpperCase();
        let textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({
        categories: newData,
        isSearching: true,
      });
    } else {
      this.setState({
        categories: this.state.copyCategories,
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
              <h3>List of Expertise Catgories</h3>
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
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  window.location.href = "/addExpertiseCategories";
                }}
              >
                Add new Category
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Name </th>
                </tr>
              </thead>

              <tbody>
                {this.state.categories &&
                  this.state.categories.map((cat, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>

                        <td>{cat.name}</td>
                        <td>
                          <button
                            onClick={() =>
                              (window.location.href = `/addExpertise/${cat.name}`)
                            }
                            className={`btn btn-sm btn-success`}
                          >
                            Add
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              (window.location.href = `/associateCompany/${cat.name}`)
                            }
                            className={`btn btn-sm btn-success`}
                          >
                            Associate Company
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              this.deleteExpertiseUsingArray(cat);
                            }}
                            className={`btn btn-sm btn-danger`}
                          >
                            Delete
                            {/* {post.statusAdmin && post.statusAdmin === "Block"
                              ? "Unblock"
                              : "Block"} */}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {/* <button
            onClick={() => this.updateLanguages()}
            className={`btn btn-sm btn-success`}
          >
            Save
          </button> */}
        </div>
      </div>
    );
  }
}
