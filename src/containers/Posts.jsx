import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pagination } from "react-bootstrap";
import moment from "moment";
import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
import {
  connectFirebase,
  getAllData,
  getAllOfCollection,
  getData,
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
      events: [],
      copyEvents: [],
      userPosts: [],
      copyPosts: [],
    };
  }
  async componentWillMount() {
    if (Cookie.get("token")) {
      var posts = [];
      // let allPosts = await getAllOfCollection("Posts");
      let allPosts = await getAllData("show-all-posts");
      debugger
      this.setState({ userPosts: allPosts.data.data, copyPosts: allPosts });
      console.log("This is the post", allPosts);
    } else {
      this.props.history.push("/login");
    }
  }

  async updateThisPost(doc, field, val) {
    let allUsers = await updateData("Posts", doc, field, val)
      .then(() => {
        if (val === "Block") {
          this.componentWillMount();
          alert("Post Blocked Successfully");
        } else {
          this.componentWillMount();
          alert("Post Unblocked Successfully");
        }
      })
      .catch(() => {
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
      let newData = this.state.userPosts.filter(function (item) {
        let itemData = item.creatorName
          ? item.creatorName.toUpperCase()
          : "".toUpperCase();
        let textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({
        userPosts: newData,
        isSearching: true,
      });
    } else {
      this.setState({
        userPosts: this.state.copyPosts,
        isSearching: false,
      });
    }
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({ q: event.target.value });
    this.FilterFn(event.target.value);
  };
  sortPostsByDate = () => {
    this.setState({
      userPosts: this.state.userPosts.sort(function (x, y) {
        return new Date(y.createdAt.seconds) - new Date(x.createdAt.seconds);
      }),
    });
  };
  sortPostsByName = () => {
    this.setState({
      userPosts: this.state.userPosts.sort(function (x, y) {
        console.log("Thiss is the great", x, y);
        console.log("THis is greater", y.creatorName < x.creatorName);
        return y.creatorName < x.creatorName;
      }),
    });
  };

  render() {
    const { events } = this.state;
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
                    // console.log(
                    //   moment(
                    //     new Date(Date.UTC(1970, 0, 1)).setUTCSeconds(
                    //       post.createdAt.seconds
                    //     )
                    //   ).format("YYYY-MM-DD")
                    // moment(
                    //   new Date(Date.UTC(1970, 0, 1)).setUTCSeconds(
                    //     post.createdAt
                    //   )
                    // ).fromNow()
                    // );

                    return (
                      <tr key={post.id}>
                        <td>{index + 1}</td>
                        <td>
                          {" "}
                          <img
                            src={post.images && post.images[0]}
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
                          {/* {moment(
                            new Date(Date.UTC(1970, 0, 1)).setUTCSeconds(
                              post.created_at.seconds
                            )
                          ).format("YYYY-MM-DD")} */}
                          {moment(new Date(post.created_at)).format("YYYY-MM-DD")}
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              this.updateThisPost(
                                post.id,
                                "statusAdmin",
                                post.statusAdmin && post.statusAdmin === "Block"
                                  ? "Unblock"
                                  : "Block"
                              );
                            }}
                            className={`btn btn-sm btn-danger`}
                          >
                            {post.statusAdmin && post.statusAdmin === "Block"
                              ? "Unblock"
                              : "Block"}
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
          </div>
        </div>
      </div>
    );
  }
}
