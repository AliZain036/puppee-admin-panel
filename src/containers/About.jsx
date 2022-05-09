import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import RichTextEditor from "react-rte";
// import {Pagination} from 'react-bootstrap';
import "./style.css";
import SwalAutoHide from "sweetalert2";
import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
import {
  connectFirebase,
  getAllOfCollection,
  getData,
  addToArray,
  updateData,
  addUpdateData,
  getAllData,
} from "../backend/utility";
const token = Cookie.get("clobberswap_access_token");

export default class About extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // editorState: EditorState.createEmpty(),
      description: "",
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

  componentDidMount() {
    this.getAboutUsDescription()  
  }

  async getAboutUsDescription() {
    let result = await getAllData("show-aboutus");
    if(result) {
      this.setState({ description: result.data.description });
    }
  }

  onChange = (value) => {
    console.log(value.toString("html"));
    this.setState({ description: value.toString("html") });
    console.log(this.state.description);
  };

  async updateAbout() {
    let reqBody = {
      description: this.state.description
    }
    let result = await addUpdateData("add-aboutus", reqBody);
    debugger;
    if (result) {
      this.setState({ description: result.data.description });
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
        title: "Failed.",
        showConfirmButton: false,
        text: "Something went wrong!!",
      });
    }
  }

  // setDescription(description) {
  //   const { description } = this.state;
  //   description = description.toString("html");
  //   // description = RichTextEditor.createValueFromString(description, "html");
  //   this.setState({
  //     description,
  //   });
  // }

  // componentWillMount() {
  //   console.log("######", this.props);
  //   this.fetchOrders();
  // }

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
              onClick={() => this.updateAbout()}
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
