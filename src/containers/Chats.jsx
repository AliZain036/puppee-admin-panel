import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pagination } from "react-bootstrap";
import moment from "moment";
import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
const token = Cookie.get("clobberswap_access_token");

import HasRole from "../hoc/HasRole";
import { getData, saveData } from "../backend/utility";

export default class Chats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      activePage: 1,
      pages: 1,
      q: "",
      responseMessage: "Loading Colors...",
      chats: [],
      copyChats: [],
    };
  }
  componentWillMount() {
    this.fetchBanners();
  }

  componentDidMount = async () => {
    // let oldUser = await getData("Users", "WU9k3GYeUKaSQBGQzTFrZQKHxXA3");
    // await saveData("Chats", "WU9k3GYeUKaSQBGQzTFrZQKHxXA3", {
    //   AK6bhT19bWa3XikkG1G: [
    //     {
    //       _id: 1,
    //       text: "Hello developer",
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: "Junaid saleem",
    //         avatar:
    //           "https://firebasestorage.googleapis.com/v0/b/streetdrive-cb4a0.appspot.com/o/images%2Fprofilepic.png?alt=media&token=a170e830-dcdd-4c3a-a156-30fc1f467e34",
    //       },
    //     },
    //   ],
    // });
    let chats = await getAllOfCollection("Chats");

    let ChatKeys = this.setState({ chats: chats, copyChats: chats });

    //Add loop for fetching all chats
  };

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
              <h3>List of Chats</h3>
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

            {/* <div className="col-sm-4 pull-right mobile-space">
              <Link to="colors/colors-form">
                <button type="button" className="btn btn-success">
                  Add new Color
                </button>
              </Link>
            </div> */}
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Person 1</th>
                  <th>Person 2</th>
                  <th>Created At</th>
                  {/* <th>Date</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Adam Smith</td>
                  <td>John Doe</td>
                  <td>02-Nov-2020</td>
                  <td>
                    <Link to="/chatDetails">
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
