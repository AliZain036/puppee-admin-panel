import React from "react";
import { Link } from "react-router-dom";
import Cookie from "js-cookie";
import SwalAutoHide from "sweetalert2";
import { getAllData, deleteRecord, searchData } from "../backend/utility";

export default class ExpertiseCategories extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      searchQuery: "",
    };
  }

  async componentDidMount() {
    this.getAllCategories();
  }

  async getAllCategories() {
    let result = await getAllData("show-categories");
    if (result) {
      this.setState({ categories: result.data });
    }
  }

  async deleteExpertise(category) {
    let reqBody = {
      category_id: category.id,
    };
    let result = await deleteRecord("delete-category", reqBody);
    if (result) {
      this.getAllCategories();
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: "Expertise Category Deleted Successfully",
      });
    } else {
      SwalAutoHide.fire({
        icon: "error",
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
      searchResults = await searchData("search-categories", reqBody);
      if (searchResults.data && searchResults.data.length > 0) {
        this.setState({ categories: searchResults.data, searchQuery: "" });
      } else {
        this.setState({ categories: [], searchQuery: "" });
      }
    } else {
      this.getAllCategories();
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Expertise Categories</h3>
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
              <Link to={"/addExpertiseCategories"}>
                <button type="button" className="btn btn-success">
                  Add New Category
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
                {this.state.categories &&
                  this.state.categories.map((cat, index) => {
                    return (
                      <tr key={cat.id}>
                        <td>{index + 1}</td>
                        <td>{cat.name}</td>
                        <td>
                          <Link
                            to={{
                              pathname: `/associateCompany/${cat.name}`,
                              state: { category: cat },
                            }}
                          >
                            <button className={`btn btn-sm btn-success`}>
                              Associate Company
                            </button>
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={{
                              pathname: `/updateCategory`,
                              state: { category: cat },
                            }}
                          >
                            <button type="button" className="btn btn-success">
                              Update
                            </button>
                          </Link>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              this.deleteExpertise(cat);
                            }}
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
