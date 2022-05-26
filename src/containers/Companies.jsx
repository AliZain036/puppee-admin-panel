import React from "react";
import { Link } from "react-router-dom";
import Cookie from "js-cookie";
import SwalAutoHide from "sweetalert2";
import { getAllData, deleteRecord, searchData } from "../backend/utility";

export default class Companies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      companies: [],
      searchQuery: "",
    };
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
      this.getCompanies();
    }
  }

  render() {
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
                          <Link to={`/updateCompany/${company.id}`}>
                            <button
                              type="button"
                              className="btn btn-sm btn-success"
                            >
                              Update
                            </button>
                          </Link>
                        </td>
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
        </div>
      </div>
    );
  }
}
