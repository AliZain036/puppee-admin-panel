import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Cookie from "js-cookie";
import {
  addUpdateData,
  getAllData,
  searchData,
} from "../backend/utility";
import SwalAutoHide from "sweetalert2";

export default class Posts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userPosts: [],
      searchQuery: "",
    };
  }
  async componentDidMount() {
    if (Cookie.get("token")) {
      this.getAllPosts();
    } else {
      this.props.history.push("/login");
    }
  }

  async getAllPosts() {
    let allPosts = await getAllData("show-all-posts");
    this.setState({ userPosts: allPosts.data.data });
  }

  async handleSearch() {
    let { searchQuery } = this.state;
    searchQuery = searchQuery.trim();
    let searchResults;
    if (searchQuery.length > 0) {
      let reqBody = {
        query: searchQuery,
      };
      searchResults = await searchData("search-posts", reqBody);
      if (searchResults.data && searchResults.data.length > 0) {
        this.setState({ userPosts: searchResults.data, searchQuery: "" });
      } else {
        this.setState({ userPosts: [], searchQuery: "" });
      }
    } else {
      this.getAllPosts();
    }
  }

  async setPostBlockStatus(post) {
    let reqBody = {
      post_id: post.id,
    };
    let url = post.status === "active" ? "block-post" : "unblock-post";
    let result = await addUpdateData(url, reqBody);
    if (result && result.success === true) {
      this.componentDidMount();
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: result.message,
      });
    } else {
      SwalAutoHide.fire({
        icon: "error",
        timer: 2000,
        title: "Failed.",
        showConfirmButton: false,
        text: "Something went wrong!!",
      });
    }
  }

  async sortPostsByDate() {
    let allPosts = await getAllData("sort-by-date");
    this.setState({ userPosts: allPosts.data });
  }

  async sortPostsByName() {
    let allPosts = await getAllData("sort-by-name");
    this.setState({ userPosts: allPosts.data });
  }

  parsePostImage(post) {
    if (post.images) {
      let imagesArray = JSON.parse(post.images)
      return imagesArray[0]
    }
  };

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Posts</h3>
            </div>
            <div className="col-sm-4">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.searchQuery}
                  onChange={(e) =>
                    this.setState({ searchQuery: e.target.value })
                  }
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
                  this.sortPostsByName();
                }}
                style={{ marginRight: 10 }}
              >
                Sort By Name
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  this.sortPostsByDate();
                }}
              >
                Sort By Date
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Image </th>
                  <th>Posted By </th>
                  <th>Description</th>
                  <th>Address</th>
                  <th>Date Posted</th>
                </tr>
              </thead>

              <tbody>
                {this.state.userPosts &&
                  this.state.userPosts.map((post, index) => {
                    return (
                      <tr key={post.id}>
                        <td>{index + 1}</td>
                        <td>
                          {" "}
                          <img
                            src={this.parsePostImage(post)}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </td>
                        <td>
                          {post.user.first_name + " " + post.user.last_name}
                        </td>
                        <td>
                          {post.description.split(" ").slice(0, 4).join(" ")}
                        </td>

                        <td>{post.location}</td>
                        <td>
                          {moment(new Date(post.created_at)).format(
                            "YYYY-MM-DD"
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => this.setPostBlockStatus(post)}
                            className={`btn btn-sm btn-danger`}
                          >
                            {post.status && post.status === "active"
                              ? "Block"
                              : "Unblock"}
                          </button>
                        </td>
                        <td>
                          <Link to={`/updatePost/${post.id}`}>
                            <button className={`btn btn-sm btn-success`}>
                              Update
                            </button>
                          </Link>
                        </td>
                        <td>
                          <Link to={`/viewposts/${post.id}`}>
                            <button className={`btn btn-sm btn-success`}>
                              View
                            </button>
                          </Link>
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
