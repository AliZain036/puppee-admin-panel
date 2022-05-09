import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pagination, Image } from "react-bootstrap";
import moment from "moment";
import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
const token = Cookie.get("clobberswap_access_token");

import HasRole from "../hoc/HasRole";

export default class ChatDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      activePage: 1,
      pages: 1,
      q: "",
      responseMessage: "Loading Colors...",
    };
  }
  componentWillMount() {
    const { match, location, history } = this.props;
    console.log(location.item, location.userChats);

    // this.fetchBanners();
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
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Chat Details</h3>
            </div>
            <div className="col-sm-4"></div>

            {/* <div className="col-sm-4 pull-right mobile-space">
              <Link to="colors/colors-form">
                <button type="button" className="btn btn-success">
                  Add new Color
                </button>
              </Link>
            </div> */}
          </div>
          <div className=" row align-items-end content-md-center content-sm-center offset-md-3 offset-sm-1 ">
            <div className="col-sm-10 col-md-6 align-items-end  chatArea">
              <div
                className="row align-items-end chatMessage2"
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
                  <p style={{ textAlign: "start" }}>Hello</p>
                </div>
              </div>
              <div
                className="row align-items-end chatMessage"
                style={{ padding: "20px", alignContent: "flex-end" }}
              >
                <div className="col-sm-8 col-md-10">
                  <p style={{ textAlign: "end" }}>
                    Hello, How are you my friend?
                  </p>
                </div>
                <div className="col-sm-4 col-md-2">
                  <Image
                    src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                    style={{ height: "50px", width: "50px" }}
                    roundedCircle
                  />
                </div>
              </div>
              <div
                className="row align-items-end chatMessage2"
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
                  <p style={{ textAlign: "start" }}>Hello</p>
                </div>
              </div>
              <div
                className="row align-items-end chatMessage"
                style={{ padding: "20px", alignContent: "flex-end" }}
              >
                <div className="col-sm-8 col-md-10">
                  <p style={{ textAlign: "end" }}>
                    Hello, How are you my friend?
                  </p>
                </div>
                <div className="col-sm-4 col-md-2">
                  <Image
                    src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                    style={{ height: "50px", width: "50px" }}
                    roundedCircle
                  />
                </div>
              </div>
              <div
                className="row align-items-end chatMessage2"
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
                  <p style={{ textAlign: "start" }}>Hello</p>
                </div>
              </div>
              <div
                className="row align-items-end chatMessage"
                style={{ padding: "20px", alignContent: "flex-end" }}
              >
                <div className="col-sm-8 col-md-10">
                  <p style={{ textAlign: "end" }}>
                    Hello, How are you my friend?
                  </p>
                </div>
                <div className="col-sm-4 col-md-2">
                  <Image
                    src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                    style={{ height: "50px", width: "50px" }}
                    roundedCircle
                  />
                </div>
              </div>
              <div
                className="row align-items-end chatMessage2"
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
                  <p style={{ textAlign: "start" }}>Hello</p>
                </div>
              </div>
              <div
                className="row align-items-end chatMessage"
                style={{ padding: "20px", alignContent: "flex-end" }}
              >
                <div className="col-sm-8 col-md-10">
                  <p style={{ textAlign: "end" }}>
                    Hello, How are you my friend?
                  </p>
                </div>
                <div className="col-sm-4 col-md-2">
                  <Image
                    src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                    style={{ height: "50px", width: "50px" }}
                    roundedCircle
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
