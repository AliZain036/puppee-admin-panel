import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pagination } from "react-bootstrap";
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
    };
  }
  componentWillMount() {
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
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Menus</h3>
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
                  onChange={(event) =>
                    this.setState({ q: event.target.value }, () => {
                      if (this.state.q === "") {
                        this.fetchBanners();
                      }
                    })
                  }
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
                  Add new Menu
                </button>
              </Link>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Image</th>
                  {/* <th>Image</th> */}
                  <th>Name</th>
                  {/* <th>Date</th> */}
                </tr>
              </thead>
              {/* <tbody>
                {this.state.brands && this.state.brands.length >= 1 ? (
                  this.state.brands.map((brand, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{brand.id}</td>
                      
                      <td>{brand.name}</td>
                      <td>
                        <Link
                          to={{
                            pathname: `/colors/edit-colors/${brand.id}`,
                            dataToPass: { brand },
                          }}
                        >
                          <span
                            className="fa fa-edit"
                            aria-hidden="true"
                          ></span>
                        </Link>
                      </td>
                      <td>
                        <span
                          className="fa fa-trash"
                          aria-hidden="true"
                          style={{ cursor: "pointer" }}
                          onClick={() => this.deleteBrand(brand.id, index)}
                        ></span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="15" className="text-center">
                      {this.state.responseMessage}
                    </td>
                  </tr>
                )}
              </tbody> */}
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <img
                      style={{ height: "50px", width: "50px" }}
                      src="data:image/jpeg;base64,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"
                    />
                  </td>
                  <td>John Doe</td>
                  <td>
                    <Link to="/viewMenuDetails/1">
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
                  <td>
                    <span
                      className="fa fa-trash"
                      aria-hidden="true"
                      style={{ cursor: "pointer" }}
                      // onClick={() => this.deleteOrders(topic.id, index)}
                    ></span>
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
