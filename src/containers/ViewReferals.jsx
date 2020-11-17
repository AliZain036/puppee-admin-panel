import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pagination, Image } from "react-bootstrap";
import moment from "moment";
import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
const token = Cookie.get("clobberswap_access_token");

import HasRole from "../hoc/HasRole";

export default class CoverBanner extends React.Component {
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
  componentWillMount() {
    this.fetchBanners();
  }

  componentDidMount() {
    const { match, location, history } = this.props;
    console.log(location.item);
    this.setState({ eventDetail: location.item });
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
              <h3>Referal Details</h3>
            </div>
          </div>
          <div className="row content-sm-left content-md-left">
            <div
              className="col-sm-10  offset-sm-1"
              style={{ textAlign: "left" }}
            >
              <div className="row space-1">
                <div className="col-sm-4" style={{ textAlign: "left" }}>
                  <h4 style={{ textAlign: "left", marginTop: "25px" }}>
                    Client Information:
                  </h4>
                  <h5 style={{ textAlign: "left" }}>Melanie Wilson</h5>
                  <h5 style={{ textAlign: "left" }}>778-7778-7778</h5>
                  <h5 style={{ textAlign: "left" }}>
                    melanie_wilson@gmail.com
                  </h5>
                  <h5 style={{ textAlign: "left" }}>
                    Financial Pre-Qalified. Contact by phone at earliest
                    opportunity
                  </h5>
                </div>
              </div>
              <h5 style={{ textAlign: "left", marginTop: "25px" }}>
                Property Type: Resedential
              </h5>
              <h5 style={{ textAlign: "left" }}>
                Property Location: Burnaby, BC
              </h5>
              <h5 style={{ textAlign: "left" }}>Price Range: $100K-$500K</h5>
              <h5 style={{ textAlign: "left" }}>Referal Agreement: 25%</h5>
              <h5 style={{ textAlign: "left" }}>Referal Status: Accepted</h5>
              <button
                className={`btn btn-sm btn-primary`}
                style={{ marginTop: "25px" }}
              >
                Download Agreement Form
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
