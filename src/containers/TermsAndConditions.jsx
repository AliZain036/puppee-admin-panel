import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import RichTextEditor from "react-rte";
// import {Pagination} from 'react-bootstrap';
import "./style.css";
import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
const token = Cookie.get("clobberswap_access_token");
import {
  addUpdateData,
  connectFirebase,
  getAllOfCollection,
  getData,
  updateData,
} from "../backend/utility";
import SwalAutoHide from "sweetalert2";

export default class Posts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      description: "",
      posts: [],
      activePage: 1,
      pages: 1,
      q: "",
      pageSize: 10,
      responseMessage: "Loading Posts...",
      status: "all",
    };
    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {
    let allTerms = await getAllOfCollection("terms");
    console.log("this is all about", allTerms[0].terms);
    this.setState({ description: allTerms[0].terms });
  }

  onChange = (value) => {
    console.log(value.toString("html"));
    this.setState({ value: value.toString("html") });
  };
  setDescription(description) {
    const { specialOffer } = this.state;
    specialOffer.description = description.toString("html");
    this.setState({
      specialOffer,
      description,
    });
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

  async updateTerms() {
    let reqBody = {
      description: this.state.description
    }
    let result = await addUpdateData("add-terms-conditions", reqBody);
    debugger;
    if(result) {
      this.setState({description: result.data.description})
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: "Terms and Conditions Updated Successfully",
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

  render() {
    const { status } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-12"></div>
            <textarea
              value={this.state.description}
              onChange={(e) => {
                // this.setDescription(e);
                // console.log(e);
                this.setState({
                  description: e.target.value,
                });
              }}
              style={{ minHeight: 300, marginBottom: 20, width: "100%" }}
            />
            <button
              onClick={() => this.updateTerms()}
              className={`btn btn-sm btn-success`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}
