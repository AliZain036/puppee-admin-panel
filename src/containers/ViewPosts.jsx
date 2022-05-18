import React from "react";
import moment from "moment";
import Cookie from "js-cookie";
import { getDataById, getAllData } from "../backend/utility";

export default class ViewPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailedPost: null,
      allUsers: [],
      postImages: [],
      allComments: [],
      allLikes: [],
      postDetails: {},
      postImages: [],
    };
  }

  getUserByID(item) {
    let reactionUser = {};
    if (item) {
      reactionUser = this.state.allUsers.find(
        (user) => user.id === item.user_id
      );
      return reactionUser;
    }
  }

  async componentDidMount() {
    if (Cookie.get("token")) {
      let userPost = await getDataById("show-post", {
        post_id: this.props.match.params.postId,
      });
      debugger;
      this.setState({ postDetails: userPost && userPost.data });

      // .then((res) => {
      //   post = res.data.data.find(
      //     (el) => el.id == this.props.match.params.postId
      //   );
      //   let postImages = JSON.parse(post.images);
      //   this.setState({
      //     allPosts: res.data.data,
      //     postDetails: post,
      //     postImages,
      //   });
      // });
      // let users = await getAllData("show-users");
      // let postLikes = await getDataById("show-reactions", {
      //   post_id: post && post.id,
      // });
      // debugger
      // this.setState({ allUsers: users.data, allLikes: postLikes.data });
      // await this.getPostDetail();
    } else {
      this.props.history.push("/login");
    }
  }

  async getPostDetail(post) {
    // const { postId } = this.props.match.params;
    // const reqBody = {
    //   post_id: postId,
    // };
    // let postDetail = await getDataById("show-post", reqBody);
    let postComments = [];
    let postReactions = [];
    if (post) {
      postComments = await getDataById("show-comments", {
        post_id: post.id,
      });
      postReactions = await getDataById("show-reactions", {
        post_id: post.id,
      });
      if (postComments.data) {
        this.setState({ allComments: postComments.data });
      }
      if (postReactions.data) {
        this.setState({ allLikes: postReactions && postReactions.data });
      }
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
                    JSON.parse(postDetails.images).map((photoUrl, index) => {
                      return (
                        <div
                          className="col-sm-4"
                          key={index}
                          style={{ textAlign: "left" }}
                        >
                          <img
                            src={photoUrl || ""}
                            style={{ width: "250px", height: "200px" }}
                            alt="Post Image"
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
                  Date:{" "}
                  {moment(new Date(postDetails.created_at)).format(
                    "YYYY-MM-DD"
                  )}
                </h5>
                <h5 style={{ textAlign: "left" }}>
                  Caption: {postDetails.description}
                </h5>
                <h4>
                  Comments{" "}
                  {" (" + this.state.postDetails &&
                    this.state.postDetails.comments &&
                    this.state.postDetails.comments.length + ") "}
                </h4>
                <h4>
                  Liked By{" "}
                  {" (" + this.state.postDetails &&
                    this.state.postDetails.reactions &&
                    this.state.postDetails.reactions.length + ") "}
                </h4>
                <div className="commentSection">
                  {postDetails.reactions &&
                    postDetails.reactions.map((item, index) => {
                      return (
                        <div
                          key={item.id}
                          className="row align-items-end comment"
                          style={{ padding: "20px", alignContent: "flex-end" }}
                        >
                          <div className="col-sm-4 col-md-2">
                            <img
                              src={
                                item.user &&
                                item.user.profile &&
                                item.user.profile.profile_image
                              }
                              style={{
                                height: "50px",
                                width: "50px",
                                borderRadius: "50%",
                              }}
                            />
                          </div>
                          <div className="col-sm-8 col-md-10">
                            <p
                              style={{ textAlign: "start", fontWeight: "bold" }}
                            >
                              {item.user &&
                                item.user.first_name +
                                  " " +
                                  item.user.last_name}
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
