import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pagination } from "react-bootstrap";
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

export default class CoverBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      activePage: 1,
      pages: 1,
      q: "",
      responseMessage: "Loading Colors...",
      events: [],
      copyEvents: [],
    };
  }
  async componentWillMount() {
    connectFirebase();
    this.fetchBanners();

    let allEvents = await getAllOfCollection("Events");
    this.setState({ events: allEvents, copyEvents: allEvents });
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

  async FilterFn(text) {
    if (text !== "") {
      let newData = this.state.events.filter(function (item) {
        let itemData = item.eventName
          ? item.eventName.toUpperCase()
          : "".toUpperCase();
        let textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({
        events: newData,
        isSearching: true,
      });
    } else {
      this.setState({
        events: this.state.copyEvents,
        isSearching: false,
      });
    }
  }
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({ q: event.target.value });
    this.FilterFn(event.target.value);
  };

  render() {
    const { events } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Referals</h3>
            </div>
            <div className="col-sm-4">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={this.handleInputChange}
                  // onChange={(event) => this.setState({q: event.target.value})}
                  // onChange={(event) =>
                  //   this.setState({ q: event.target.value }, () => {
                  //     if (this.state.q === "") {
                  //       this.fetchBanners();
                  //     }
                  //   })
                  // }
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      this.handleSearch();
                    }
                  }}
                />
                <span className="input-group-btn">
                  <button
                    type="button"
                    onClick={() => this.handleSearch()}
                    className="btn btn-info search-btn"
                  >
                    Search
                  </button>
                </span>
              </div>
            </div>

            <div className="col-sm-4 pull-right mobile-space">
              <Link to="colors/colors-form">
                <button type="button" className="btn btn-success">
                  Add new Referal
                </button>
              </Link>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Client Name</th>
                  <th>Property type</th>
                  <th>Referral sender</th>
                  <th>Referral receiver</th>
                  <th>Creation Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Melanie Wilson</td>
                  <td>Villa</td>
                  <td>John Doe</td>
                  <td>Adam Smith</td>
                  <td>27-November-2020</td>
                  <td>Accepted</td>
                  <td>
                    <Link to="/viewReferal">
                      <button
                        // onClick={() =>
                        //   topic.status === "block"
                        //     ? this.unblockPostHandler(topic.id)
                        //     : this.blockPostHandler(topic.id)
                        // }
                        className={`btn btn-sm btn-success`}
                      >
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
