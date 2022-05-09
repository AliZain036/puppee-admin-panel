import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pagination, Image } from "react-bootstrap";
import moment from "moment";
import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
const token = Cookie.get("clobberswap_access_token");
import {
  connectFirebase,
  getAllOfCollection,
  getData,
  getDataById,
  getAllData,
} from "../backend/utility";
import firebase from "firebase";
import HasRole from "../hoc/HasRole";
import { getPost } from "../api/services/Post";
import { getComments } from "../api/services/Comments";

export default class ViewPosts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      detailedPost: null,
      activePage: 1,
      pages: 1,
      q: "",
      responseMessage: "Loading Colors...",
      eventDetail: {},
      allUsers: [],
      allComments: [],
      allLikes: [],
      postDetails: {},
    };
  }

  async getPostComments(id) {
    let reqBody = {
      // post_id: this.state.postDetails.id
      post_id: 2,
    };
    const { data } = await getComments("show-comments", reqBody);
    return data;
  }

  getUserByID = (item) => {
    let reactionUser = {};
    reactionUser = this.state.allUsers.find((user) => user.id === item.id);
    return reactionUser;
  };

  async componentDidMount() {
    if (Cookie.get("token")) {
      let allPosts = await getAllData("show-all-posts");
      let { data } = await getAllData("show-users");
      debugger;
      this.setState({ allUsers: data, allPosts: allPosts.data.data });
      await this.getPostDetail();
      // await this.getPostComments();
    } else {
      this.props.history.push("/login");
    }
  }

  async getPostDetail() {
    const { postId } = this.props.match.params;
    const reqBody = {
      post_id: postId,
    };
    let postDetail = await getDataById("show-post", reqBody);
    debugger;
    let postComments = [];
    let postReactions = [];
    if (postDetail) {
      postComments = await getDataById("show-comments", {
        post_id: postDetail.data.id,
      });
      postReactions = await getDataById("show-reactions", {
        post_id: postDetail.data.id,
      });
      if (postComments.data) {
        this.setState({ allComments: postComments.data });
      }
      if (postReactions.data) {
        this.setState({ allLikes: postReactions && postReactions.data });
      }
      this.setState({
        postDetails: postDetail.data,
      });
    }
  }

  fetchBanners = () => {
    axios
      .get(`${API_END_POINT}/api/show-colors`, {
        headers: { "auth-token": token },
      })
      .then((response) => {
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

  handleSearch() {
    const { q } = this.state;
    if (q.length) {
      this.setState({
        loading: true,
        brands: [],
        responseMessage: "Loading Colors...",
      });
      axios
        .get(`${API_END_POINT}/api/brands/search`, {
          params: { searchWord: this.state.q },
          headers: { "auth-token": token },
        })
        .then((response) => {
          this.setState({
            brands: response.data.searchedItems,
            loading: false,
            responseMessage: "No Brands Found...",
          });
        })
        .catch(() => {
          this.setState({
            loading: false,
            responseMessage: "No Brands Found...",
          });
        });
    }
  }

  render() {
    const { postDetails } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Post Details</h3>
            </div>
          </div>
          <div className="row content-sm-left content-md-left">
            {postDetails && (
              <div
                className="col-sm-10  offset-sm-1"
                style={{ textAlign: "left" }}
              >
                <div className="row space-1">
                  {postDetails.images &&
                    postDetails.images.map((photo, index) => {
                      return (
                        <div
                          className="col-sm-4"
                          key={index}
                          style={{ textAlign: "left" }}
                        >
                          <img
                            src={photo}
                            style={{ width: "250px", height: "200px" }}
                          />
                        </div>
                      );
                    })}
                </div>
                <h5 style={{ textAlign: "left", marginTop: "25px" }}>
                  Creator Name :
                  {postDetails.user &&
                    postDetails.user.first_name +
                      " " +
                      postDetails.user.last_name}
                </h5>
                <h5 style={{ textAlign: "left" }}>
                  Creator Profession:{" "}
                  {postDetails.user &&
                    postDetails.user.profile &&
                    postDetails.user.profile.profession}
                </h5>
                <h5 style={{ textAlign: "left" }}>
                  Creator Office:{" "}
                  {postDetails.user &&
                    postDetails.user.profile &&
                    postDetails.user.profile.company_name}
                </h5>
                <h5 style={{ textAlign: "left" }}>
                  Adress:{" "}
                  {postDetails.user &&
                    postDetails.user.profile &&
                    postDetails.user.profile.brokerage_address}
                </h5>
                <h5 style={{ textAlign: "left" }}>
                  Date: {moment(new Date(postDetails.created_at)).format("YYYY-MM-DD")}
                </h5>
                <h5 style={{ textAlign: "left" }}>
                  Caption: {postDetails.description}
                </h5>
                <h4>
                  Comments{" "}
                  {" (" + this.state.allComments &&
                    this.state.allComments.length + ") "}
                </h4>
                <div className="commentSection">
                {this.state.allComments.map((comment) => {
                  var tageName = "";
                  var tagId = "";
                  var commentText = comment.comment;
                  var CleanComment = "";
                  var foundTag = false;
                  var ignoreZone1 = false;
                  for (var i = 0; i < commentText.length; i++) {
                    if (foundTag === false) {
                      if (commentText[i] === "(") {
                        ignoreZone1 = true;
                      } else if (commentText[i] === ")") {
                        ignoreZone1 = false;
                      } else if (ignoreZone1 === false) {
                        CleanComment = CleanComment + commentText[i];
                      }
                    } else {
                      if (commentText[i] != "[" && commentText[i] != "]") {
                        CleanComment = CleanComment + commentText[i];
                      }
                      if (commentText[i] === "]") {
                        foundTag = false;
                      }
                    }
                    if (commentText[i] === "@" && commentText[i + 1] === "[") {
                      foundTag = true;
                    }
                  }
                  console.log("fount tag in comment", CleanComment);
                  return (
                    <div
                      className="row comment"
                      style={{ padding: "20px", alignContent: "flex-end" }}
                    >
                      <div className="col-sm-4 col-md-2">
                        <Image
                          src={comment.photo}
                          style={{
                            height: "50px",
                            width: "50px",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                      <div className="col-sm-8 col-md-10">
                        <p
                          style={{
                            textAlign: "start",
                            marginBottom: 0,
                            fontWeight: "bold",
                          }}
                        >
                          {comment.userName}
                        </p>
                        <span>
                          Time:{" "}
                          {moment(new Date(comment.created_at)).format(
                            "YYYY-MM-DD"
                          )}
                        </span>
                        <p style={{ textAlign: "start" }}>{CleanComment}</p>
                        <p style={{ textAlign: "start" }}>
                          Likes :{comment.likes ? comment.likes.length : 0}{" "}
                        </p>
                        <p style={{ textAlign: "start" }}></p>
                      </div>{" "}
                      {comment.replies &&
                        comment.replies.map((rep) => {
                          var tageName = "";
                          var tagId = "";
                          var replyText = rep.reply;
                          var CleanReply = "";
                          var foundReplyTag = false;
                          var ignoreZone = false;
                          for (var i = 0; i < replyText.length; i++) {
                            if (foundReplyTag === false) {
                              if (replyText[i] === "(") {
                                ignoreZone = true;
                              } else if (replyText[i] === ")") {
                                ignoreZone = false;
                              } else if (ignoreZone === false) {
                                CleanReply = CleanReply + replyText[i];
                              }
                            } else {
                              if (replyText[i] != "[" && replyText[i] != "]") {
                                CleanReply = CleanReply + replyText[i];
                              }
                              if (replyText[i] === "]") {
                                foundReplyTag = false;
                              }
                            }
                            if (
                              replyText[i] === "@" &&
                              replyText[i + 1] === "["
                            ) {
                              foundReplyTag = true;
                            }
                          }
                          console.log("this is comment reply", CleanReply);
                          return (
                            <div
                              className="row"
                              style={{
                                padding: "10px",
                                paddingLeft: 30,
                                alignContent: "flex-end",
                              }}
                            >
                              <div className="col-sm-4 col-md-3">
                                <Image
                                  src={rep.photo}
                                  style={{
                                    height: "50px",
                                    width: "50px",
                                    borderRadius: "50%",
                                  }}
                                  roundedCircle
                                />
                              </div>
                              <div className="col-sm-8 col-md-9">
                                <p
                                  style={{
                                    textAlign: "start",
                                    marginBottom: 0,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {rep.userName}
                                </p>
                                <span>
                                  Time:{" "}
                                  {moment(
                                    new Date(
                                      Date.UTC(1970, 0, 1)
                                    ).setUTCSeconds(rep.time)
                                  ).fromNow()}
                                </span>
                                <p style={{ textAlign: "start" }}>
                                  {CleanReply}
                                </p>
                                <p style={{ textAlign: "start" }}>
                                  Likes :{rep.likes ? rep.likes.length : 0}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
              <h4>
                Liked By{" "}
                {" (" + this.state.allLikes &&
                  this.state.allLikes.length + ") "}
              </h4>
              <div className="commentSection">
                {this.state.allLikes && this.state.allLikes.map((item, index) => {
                  var user = this.getUserByID(item);
                  return (
                    <div
                      key={item.id}
                      className="row align-items-end comment"
                      style={{ padding: "20px", alignContent: "flex-end" }}
                    >
                      <div className="col-sm-4 col-md-2">
                        <Image
                          src={user && user.profile && user.profile.profile_image}
                          style={{
                            height: "50px",
                            width: "50px",
                            borderRadius: "50%",
                          }}
                          roundedCircle
                        />
                      </div>
                      <div className="col-sm-8 col-md-10">
                        <p style={{ textAlign: "start", fontWeight: "bold" }}>
                          {user.first_name + " " + user.last_name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
