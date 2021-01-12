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
      transactions: [],
      detailedReferal: null,
    };
  }
  async componentWillMount() {}

  async componentDidMount() {
    let allTransactions = await getAllOfCollection("Transactions");
    console.log("THis is", allTransactions);
    allTransactions.map((trans) => {
      if (trans.transaction_id === this.props.match.params.refId) {
        this.setState({ detailedReferal: trans });
      }
    });
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
            {this.state.detailedReferal && (
              <div
                className="col-sm-10  offset-sm-1"
                style={{ textAlign: "left" }}
              >
                <div className="row space-1">
                  <div className="col-sm-4" style={{ textAlign: "left" }}>
                    <h4 style={{ textAlign: "left", marginTop: "25px" }}>
                      Client Information:
                    </h4>
                    <h5 style={{ textAlign: "left" }}>
                      {this.state.detailedReferal.clientName}
                    </h5>
                    <h5 style={{ textAlign: "left" }}>
                      {this.state.detailedReferal.clientPhone}
                    </h5>
                    <h5 style={{ textAlign: "left" }}>
                      {this.state.detailedReferal.clientEmail}
                    </h5>
                    <h5 style={{ textAlign: "left" }}>
                      {this.state.detailedReferal.additionalInfo}
                    </h5>
                  </div>
                </div>
                <h5 style={{ textAlign: "left", marginTop: "25px" }}>
                  Property Type: {this.state.detailedReferal.propertyType}
                </h5>
                <h5 style={{ textAlign: "left" }}>
                  Property Location:{" "}
                  {this.state.detailedReferal.propertyLocation}
                </h5>
                <h5 style={{ textAlign: "left" }}>
                  Price Range: ${this.state.detailedReferal.priceRangeValues[0]}
                  K-${this.state.detailedReferal.priceRangeValues[1]}K
                </h5>
                <h5 style={{ textAlign: "left" }}>
                  Referal Agreement: {this.state.detailedReferal.percentage}
                </h5>
                <h5 style={{ textAlign: "left" }}>
                  Referal Status: {this.state.detailedReferal.status}
                </h5>
                <button
                  className={`btn btn-sm btn-primary`}
                  style={{ marginTop: "25px" }}
                >
                  Download Agreement Form
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
