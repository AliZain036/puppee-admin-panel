import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pagination, Image } from "react-bootstrap";
import moment from "moment";
import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
import {
  connectFirebase,
  getAllOfCollection,
  getData,
} from "../backend/utility";
const token = Cookie.get("clobberswap_access_token");

import HasRole from "../hoc/HasRole";

export default class ViewEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      activePage: 1,
      pages: 1,
      q: "",
      responseMessage: "Loading Colors...",
      eventDetail: {},
    };
  }
  componentDidMount() {
    connectFirebase();
    const { match, location, history } = this.props;
    console.log(location.item);
    this.setState({ eventDetail: location.item });
    this.fetchBanners();
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
              <h3>Event Details</h3>
            </div>
          </div>
          <div className="row content-sm-center content-md-center">
            <div className="col-sm-10  ">
              <img
                src={eventDetail.image}
                style={{ width: "250px", height: "200px" }}
              />
              <h5 style={{ marginRight: "7vw", marginTop: "4vh" }}>
                {eventDetail.eventName && eventDetail.eventName}
              </h5>
              <h5 style={{ marginRight: "5.5vw" }}>
                <span style={{ fontWeight: "400" }}>Hosted by </span>{" "}
                {eventDetail.hostName}
              </h5>
              <h5 style={{ marginRight: "5.5vw" }}>
                <span style={{ fontWeight: "400" }}>
                  This will be a very entertaining rally from people coming from
                  50 different countries to participate
                </span>
              </h5>
              <h5 style={{ marginRight: "5.5vw" }}>
                {eventDetail.participants}{" "}
                <span style={{ fontWeight: "400" }}>Participants</span>
              </h5>
              <h5 style={{ marginRight: "5.5vw" }}>{eventDetail.date}</h5>
              <h5 style={{ marginRight: "5.5vw" }}>
                {eventDetail.participants}
              </h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
