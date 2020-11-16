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
import {
  connectFirebase,
  getAllOfCollection,
  getData,
  saveData,
} from "../backend/utility";
const token = Cookie.get("clobberswap_access_token");

export default class Posts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // editorState: EditorState.createEmpty(),
      description: RichTextEditor.createEmptyValue(),
      posts: [],
      activePage: 1,
      pages: 1,
      q: "",
      pageSize: 10,
      responseMessage: "Loading Posts...",
      status: "all",
      content: "",
    };
    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {
    connectFirebase();
    let Content = await getData("AboutUs", "Detail", "content");
    // console.log("Content:");
    // console.log("Content:", Content);
    this.setState({
      description: RichTextEditor.createValueFromString(Content, "html"),
    });
  }

  onChange = (value) => {
    console.log(value.toString("html"));
    this.setState({ description: value.toString("html") });
    console.log(this.state.description);
  };

  // setDescription(description) {
  //   const { description } = this.state;
  //   description = description.toString("html");
  //   // description = RichTextEditor.createValueFromString(description, "html");
  //   this.setState({
  //     description,
  //   });
  // }

  componentWillMount() {
    console.log("######", this.props);
    this.fetchOrders();
  }

  handleSave = async () => {
    this.setState({ loading: true });
    const { description } = this.state;
    // console.log("New content = ", description);
    await saveData("AboutUs", "Detail", {
      content: description.toString("html"),
    });
    this.setState({ loading: false });
    alert("Data saved successfully");
  };

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
    const { status, description } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-12"></div>
            <RichTextEditor
              value={description}
              onChange={(e) => {
                // this.setDescription(e);
                // console.log(e);
                this.setState({
                  description: e,
                });
              }}
              style={{ width: "100%" }}
            />
            <button
              onClick={() => this.handleSave()}
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
