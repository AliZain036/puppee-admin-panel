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
  getAllData,
  deleteRecord,
  searchData,
} from "../backend/utility";
import firebase from "firebase";
const token = Cookie.get("clobberswap_access_token");

import HasRole from "../hoc/HasRole";

export default class Companies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      activePage: 1,
      pages: 1,
      q: "",
      responseMessage: "Loading Colors...",
      languages: [],
      copyLanguages: [],
      companies: [],
      searchQuery: ""
    };
  }
  async componentWillMount() {
    // console.log("This is token now", Cookie.get("token"));
    if (Cookie.get("token")) {
      var posts = [];

      let Admin = await getAllOfCollection("Admin");
      // this.setState({ userPosts: allPosts, copyPosts: allPosts });
      console.log("This is the admin", Admin[0].companies);
      this.setState({
        languages: Admin[0].companies,
        copyLanguages: Admin[0].companies,
      });
    } else {
      this.props.history.push("/login");
    }
  }

  async updateCompanies() {
    await addToArray(
      "Admin",
      "0qYmJUZhg0WLUATMjaohcgrsGs33",
      "companies",
      this.state.languages
    )
      .then(() => {
        this.componentWillMount();
        SwalAutoHide.fire({
          icon: "success",
          timer: 2000,
          title: "Success.",
          showConfirmButton: false,
          text: "Companies Updated Successfully",
        });
      })
      .catch(() => {
        alert("Something went wrong");
      });
  }

  componentDidMount() {
    this.getCompanies();
  }

  async getCompanies() {
    let result = await getAllData("show-companies");
    if (result) {
      this.setState({ companies: result.data });
    }
  }

  async updateCompaniesUsingArray(array) {
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
        });
      })
      .catch((e) => {
        console.log("This is error", e);
        alert("Something went wrong");
      });
  }

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

  async handleDeleteCompany(company) {
    let reqBody = {
      company_id: company.id,
    };
    let result = await deleteRecord("delete-company", reqBody);
    if (result) {
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: "Company Deleted Successfully!",
      });
      this.getCompanies();
    } else {
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: "Something went wrong!!",
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
      let newData = this.state.languages.filter(function (item) {
        let itemData = item.title ? item.title.toUpperCase() : "".toUpperCase();
        let textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({
        languages: newData,
        isSearching: true,
      });
    } else {
      this.setState({
        languages: this.state.copyLanguages,
        isSearching: false,
      });
    }
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({ q: event.target.value });
    this.FilterFn(event.target.value);
  };

  async handleSearch() {
    let { searchQuery } = this.state;
    searchQuery = searchQuery.trim();
    let searchResults;
    if (searchQuery.length > 0) {
      let reqBody = {
        query: searchQuery,
      };
      searchResults = await searchData("search-companies", reqBody);
      if (searchResults.data && searchResults.data.length > 0) {
        this.setState({ companies: searchResults.data, searchQuery: "" });
      } else {
        this.setState({ companies: [], searchQuery: "" });
      }
    } else {
      this.getCompanies()
    }
  }

  render() {
    const { events } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Companies</h3>
            </div>
            <div className="col-sm-4">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.searchQuery}
                  onChange={(event) =>
                    this.setState({ searchQuery: event.target.value })
                  }
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
              <Link to={"/addCompany"}>
                <button type="button" className="btn btn-success">
                  Add new Company
                </button>
              </Link>
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
                {this.state.companies &&
                  this.state.companies.map((company, index) => {
                    return (
                      <tr key={company.id}>
                        <td>{index + 1}</td>
                        <td>{company.name}</td>
                        <td>
                          <button
                            onClick={() => this.handleDeleteCompany(company)}
                            className={`btn btn-sm btn-danger`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {/* <button
            onClick={() => this.updateCompanies()}
            className={`btn btn-sm btn-success`}
          >
            Save
          </button> */}
        </div>
      </div>
    );
  }
}
