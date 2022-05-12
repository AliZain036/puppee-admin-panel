import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
const token = Cookie.get("clobberswap_access_token");

export default class Restuarants extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      activePage: 1,
      pages: 1,
      q: "",
      pageSize: 10,
      responseMessage: "Loading Posts...",
      status: "all",
    };
  }

  componentWillMount() {
    this.fetchOrders();
  }

  fetchOrders = () => {
    axios.get(`${API_END_POINT}/api/show-all-posts`).then((response) => {
      this.setState({
        posts: response.data.posts,
        responseMessage: "No Posts Found...",
      });
    });
  };

  fetchPastOrders = () => {
    axios.get(`${API_END_POINT}/api/show-active-posts`).then((response) => {
      this.setState({
        posts: response.data.posts,
        responseMessage: "No Posts Found...",
      });
    });
  };

  fetchRequestOrders = () => {
    axios.get(`${API_END_POINT}/api/show-sold-posts`).then((response) => {
      this.setState({
        posts: response.data.posts,
        responseMessage: "No Posts Found...",
      });
    });
  };

  fetchActiveOrders = () => {
    axios.get(`${API_END_POINT}/api/show-block-posts`).then((response) => {
      this.setState({
        posts: response.data.posts,
        responseMessage: "No Posts Found...",
      });
    });
  };

  getParams() {
    const { activePage, pageSize } = this.state;
    return {
      params: {
        pageNumber: activePage,
        pageSize,
      },
    };
  }

  deleteOrders(dayId, index) {
    var data = { post_id: dayId };
    if (confirm("Are you sure you want to delete this post?")) {
      axios
        .post(`${API_END_POINT}/api/delete-post`, data)
        .then((response) => {
          if (response.status === 200 && response.data.status) {
            window.alert("Post deleted succesfully  ");
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
        responseMessage: "Loading Posts...",
      });
      // if(q === "") {
      //   this.fetchOrders();
      // } else {
      axios.post(`${API_END_POINT}/api/search-post`, data).then((response) => {
        this.setState({
          posts: response.data.posts,
          loading: false,
          responseMessage: "No Posts Found...",
        });
      });
    }
  }

  tabChangeHandler = (value) => {
    if (this.state.status !== value) {
      this.setState({
        status: value,
        loading: true,
        posts: [],
        responseMessage: "Loading Posts...",
      });
      if (value === "all") {
        this.fetchOrders();
      } else if (value === "approved") {
        this.fetchPastOrders();
      } else if (value === "unapproved") {
        this.fetchRequestOrders();
      } else if (value === "blocked") {
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
    const { status } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Restaurants</h3>
            </div>
            <div className="col-sm-4">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={(event) =>
                    this.setState({ q: event.target.value }, () => {
                      if (this.state.q === "") {
                        this.fetchOrders();
                      }
                    })
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

            {/* <div className="col-sm-4 pull-right mobile-space">
              <Link to={"/topics/topics-form"}>
                <button type="button" className="btn btn-success">
                  Add New Order
                </button>
              </Link>
            </div> */}
          </div>

          <div className="row justify-content-between">
            <div className="float-left col-sm-6 space-1">
              <button
                type="button"
                style={{
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${
                  status === "all" ? "btn-primary" : ""
                } btn btn-default`}
                onClick={() => this.tabChangeHandler("all")}
              >
                All
              </button>

              <button
                type="button"
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${
                  status === "active" ? "btn-primary" : ""
                } btn btn-default`}
                onClick={() => this.tabChangeHandler("approved")}
              >
                Approved
              </button>

              <button
                type="button"
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${
                  status === "sold" ? "btn-primary" : ""
                } btn btn-default`}
                onClick={() => this.tabChangeHandler("unapproved")}
              >
                Unapproved
              </button>

              <button
                type="button"
                style={{
                  marginLeft: 5,
                  borderRadius: 0,
                }}
                className={`${
                  status === "blocked" ? "btn-primary" : ""
                } btn btn-default`}
                onClick={() => this.tabChangeHandler("blocked")}
              >
                Blocked
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <td>Image</td>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <img
                      style={{ height: "50px", width: "50px" }}
                      src="data:image/jpeg;base64,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"
                    />
                  </td>
                  <td>Wine n Dine</td>
                  <td style={{ textTransform: "capitalize" }}>
                    Nice and cozy environment
                  </td>
                  <td style={{ textTransform: "capitalize" }}>wnd@gmail.com</td>
                  <td style={{ textTransform: "capitalize" }}>
                    Blue Lake, Commercial Area
                  </td>
                  <td>
                    <button
                      // onClick={() =>
                      //   topic.status === "block"
                      //     ? this.unblockPostHandler(topic.id)
                      //     : this.blockPostHandler(topic.id)
                      // }
                      className={`btn btn-sm btn-danger`}
                    >
                      Block
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
