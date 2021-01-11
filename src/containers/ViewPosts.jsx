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
} from "../backend/utility";

import HasRole from "../hoc/HasRole";

export default class CoverBanner extends React.Component {
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
    };
  }
  componentWillMount() {}

  async componentDidMount() {
    const { match, location, history } = this.props;
    let allPosts = await getAllOfCollection("Posts");
    allPosts.map((post) => {
      if (post.id === this.props.match.params.postId) {
        this.setState({ detailedPost: post });
      }
    });
    console.log("these are all posts in view psot", allPosts);
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
    const { eventDetail } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Post Details</h3>
            </div>
          </div>
          <div className="row content-sm-left content-md-left">
            <div
              className="col-sm-10  offset-sm-1"
              style={{ textAlign: "left" }}
            >
              <div className="row space-1">
                {this.state.detailedPost &&
                  this.state.detailedPost.photos.map((photo) => {
                    return (
                      <div className="col-sm-4" style={{ textAlign: "left" }}>
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
                {this.state.detailedPost && this.state.detailedPost.creatorName}
              </h5>
              <h5 style={{ textAlign: "left" }}>
                Creator Profession:{" "}
                {this.state.detailedPost &&
                  this.state.detailedPost.creatorProfession}
              </h5>
              <h5 style={{ textAlign: "left" }}>
                Creator Office:{" "}
                {this.state.detailedPost &&
                  this.state.detailedPost.creatorOffice}
              </h5>
              <h5 style={{ textAlign: "left" }}>
                {this.state.detailedPost && this.state.detailedPost.caption}
              </h5>
              {/* <div className="commentSection">
                <div
                  className="row align-items-end comment"
                  style={{ padding: "20px", alignContent: "flex-end" }}
                >
                  <div className="col-sm-4 col-md-2">
                    <Image
                      src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                      style={{ height: "50px", width: "50px" }}
                      roundedCircle
                    />
                  </div>
                  <div className="col-sm-8 col-md-10">
                    <p style={{ textAlign: "start" }}>Beauty at its finest</p>
                  </div>
                </div>
                <div
                  className="row align-items-end comment"
                  style={{ padding: "20px", alignContent: "flex-end" }}
                >
                  <div className="col-sm-4 col-md-2">
                    <Image
                      src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                      style={{ height: "50px", width: "50px" }}
                      roundedCircle
                    />
                  </div>
                  <div className="col-sm-8 col-md-10">
                    <p style={{ textAlign: "start" }}>Great House</p>
                  </div>
                </div>
                <div
                  className="row align-items-end comment"
                  style={{ padding: "20px", alignContent: "flex-end" }}
                >
                  <div className="col-sm-4 col-md-2">
                    <Image
                      src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                      style={{ height: "50px", width: "50px" }}
                      roundedCircle
                    />
                  </div>
                  <div className="col-sm-8 col-md-10">
                    <p style={{ textAlign: "start" }}>
                      Hell Yeah! The beast itself
                    </p>
                  </div>
                </div>
              </div>
            */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
