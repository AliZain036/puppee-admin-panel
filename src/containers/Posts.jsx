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
    // connectFirebase();
    // this.fetchBanners();
    // let allEvents = await getAllOfCollection("MyFeed");
    // let totalEvents = [];
    // for (let i = 0; i < allEvents.length; i++) {
    //   for (let j = 0; j < allEvents[i].Details.length; j++) {
    //     totalEvents.push(allEvents[i].Details[j]);
    //   }
    // }
    // // console.log(totalEvents);
    // this.setState({ events: totalEvents, copyEvents: totalEvents });
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
              <h3>List of Posts</h3>
            </div>
            <div className="col-sm-4">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  // onChange={(event) => this.setState({q: event.target.value})}
                  onChange={this.handleInputChange}
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
                  Add new Post
                </button>
              </Link>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Image </th>
                  <th>Name </th>
                  <th>Description</th>
                  <th>Address</th>
                  <th>Date Posted</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    {" "}
                    <img
                      src="https://i.pinimg.com/originals/66/d9/f5/66d9f5afdc5337d3f9eac362b970c426.jpg"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>John Smith</td>
                  <td>Best house with a view</td>

                  <td>Fort St John, BC</td>
                  <td>27-November-2020</td>
                  <td>
                    <button
                      // onClick={() =>
                      //   topic.status === "block"
                      //     ? this.unblockPostHandler(topic.id)
                      //     : this.blockPostHandler(topic.id)
                      // }
                      className={`btn btn-sm btn-danger`}
                    >
                      Block
                    </button>
                  </td>
                  <td>
                    <Link to="/viewposts">
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
                <tr>
                  <td>1</td>
                  <td>
                    {" "}
                    <img
                      src="https://i.pinimg.com/originals/66/d9/f5/66d9f5afdc5337d3f9eac362b970c426.jpg"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>John Smith</td>
                  <td>Best house with a view</td>

                  <td>Fort St John, BC</td>
                  <td>27-November-2020</td>
                  <td>
                    <button
                      // onClick={() =>
                      //   topic.status === "block"
                      //     ? this.unblockPostHandler(topic.id)
                      //     : this.blockPostHandler(topic.id)
                      // }
                      className={`btn btn-sm btn-danger`}
                    >
                      Block
                    </button>
                  </td>
                  <td>
                    <Link to="/viewposts">
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
                <tr>
                  <td>1</td>
                  <td>
                    {" "}
                    <img
                      src="https://i.pinimg.com/originals/66/d9/f5/66d9f5afdc5337d3f9eac362b970c426.jpg"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>John Smith</td>
                  <td>Best house with a view</td>

                  <td>Fort St John, BC</td>
                  <td>27-November-2020</td>
                  <td>
                    <button
                      // onClick={() =>
                      //   topic.status === "block"
                      //     ? this.unblockPostHandler(topic.id)
                      //     : this.blockPostHandler(topic.id)
                      // }
                      className={`btn btn-sm btn-danger`}
                    >
                      Block
                    </button>
                  </td>
                  <td>
                    <Link to="/viewposts">
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
