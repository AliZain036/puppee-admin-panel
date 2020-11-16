import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
const token = Cookie.get("clobberswap_access_token");

export default class Posts extends React.Component {
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
    console.log("######", this.props);
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
              <h3>Order Details</h3>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Customer Name</th>
                  <th>Qty of Items</th>
                  <th>Total amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>40</td>
                  <td style={{ textTransform: "capitalize" }}>$200</td>
                  <td>
                    <Link
                      to={{
                        pathname: `/topics/edit-topic/`,
                      }}
                    >
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span
                      className="fa fa-trash"
                      aria-hidden="true"
                      style={{ cursor: "pointer" }}
                      // onClick={() => this.deleteOrders(topic.id, index)}
                    ></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Customer Details</h3>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Customer Name</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>ABC Street</td>
                  <td style={{ textTransform: "capitalize" }}>+987654321</td>
                  <td>
                    <Link
                      to={{
                        pathname: `/viewOrderCustomer/1/1`,
                        dataToPass: {},
                      }}
                    >
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
              </tbody>
            </table>
          </div>
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Driver Details</h3>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Driver Name</th>
                  <th>Bike Number</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Adam Smith</td>
                  <td>ABC123</td>
                  <td style={{ textTransform: "capitalize" }}>+123456789</td>
                  <td>
                    <Link
                      to={{
                        pathname: `/viewOrderDriver/1/1`,
                        dataToPass: {},
                      }}
                    >
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
