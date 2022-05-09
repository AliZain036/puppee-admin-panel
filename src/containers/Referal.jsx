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
  getDataById,
} from "../backend/utility";
import firebase from "firebase";
const token = Cookie.get("clobberswap_access_token");

import HasRole from "../hoc/HasRole";

export default class Referrals extends React.Component {
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
      transactions: [],
      copyTransactions: [],
      user: {}
    };
  }

  async componentDidMount() {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      this.setState({user})
    }
    let reqBody = {
      user_id: user.id
    }
    let referrals = await getDataById('show-referrals', reqBody);
    this.setState({ transactions: referrals.data });
  }

  // async componentWillMount() {
  //   if (Cookie.get("token")) {
  //     let allUsers = await getAllOfCollection("Users");
  //     this.setState({ allUsers: allUsers });
  //     let allTransactions = await getAllOfCollection("Transactions");
  //     console.log("THis is", allTransactions);
  //     this.setState({
  //       transactions: allTransactions,
  //       copyTransactions: allTransactions,
  //     });
  //   } else {
  //     this.props.history.push("/login");
  //   }
  // }

  getUserByID = (id) => {
    // console.log("This is email", id);
    // console.log("These arre al users", this.state.allUsers);
    var myUser = "";
    this.state.allUsers.map((user) => {
      if (user.id === id) {
        myUser = user;
      }
    });
    return myUser;
  };

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page - 1) * 10}`).then((response) => {
      this.setState({
        areas: response.data.items,
        activePage: page,
      });
    });
  }

  async FilterFn(text) {
    if (text !== "") {
      let newData = this.state.transactions.filter(function (item) {
        let itemData = item.clientName
          ? item.clientName.toUpperCase()
          : "".toUpperCase();
        let textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({
        transactions: newData,
        isSearching: true,
      });
    } else {
      this.setState({
        transactions: this.state.copyTransactions,
        isSearching: false,
      });
    }
  }
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({ q: event.target.value });
    this.FilterFn(event.target.value);
  };

  sortPostsByDate = () => {
    this.setState({
      transactions: this.state.transactions.sort(function (x, y) {
        return new Date(y.createdAt.seconds) - new Date(x.createdAt.seconds);
      }),
    });
  };
  sortPostsByName = () => {
    this.setState({
      transactions: this.state.transactions.sort(function (x, y) {
        console.log("Thiss is the great", x, y);
        console.log("THis is greater", y.clientName < x.clientName);
        return y.clientName < x.clientName;
      }),
    });
  };

  render() {
    const { events } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Referrals</h3>
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
                  // onKeyPress={(event) => {
                  //   if (event.key === "Enter") {
                  //     this.handleSearch();
                  //   }
                  // }}
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
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  this.sortPostsByName();
                }}
                style={{ marginRight: 10 }}
              >
                Sort By Name
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  this.sortPostsByDate();
                }}
              >
                Sort By Date
              </button>
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
                {this.state.transactions &&
                  this.state.transactions.map((trans, index) => {
                    // var creator = this.getUserByID(trans.creator);
                    // var receiver = this.getUserByID(trans.receiver);
                    return (
                      <tr key={trans.id}>
                        <td>{index + 1}</td>
                        <td>{trans.name}</td>
                        <td>{trans.property_type}</td>
                        <td>
                          {trans.user &&
                            trans.user.first_name + " " + trans.user.last_name}
                        </td>
                        <td>
                          {trans.receiver && (
                            <Link
                              style={{ color: "black" }}
                              to={`/userdetails/${trans.receiver}`}
                            >
                              {trans.receiver.first_name +
                                " " +
                                trans.receiver.last_name}
                            </Link>
                          )}
                        </td>
                        <td>
                          {/* {moment(
                              new Date(Date.UTC(1970, 0, 1)).setUTCSeconds(
                                trans.created_at.seconds
                              )
                            ).format("YYYY-MM-DD")} */}
                          {moment(new Date(trans.created_at)).format(
                            "YYYY-MM-DD"
                          )}
                        </td>
                        <td>{trans.status}</td>
                        <td>
                          <Link to={`/referal/${trans.id}`}>
                            <button
                              className={`btn btn-sm btn-success`}
                            >
                              View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}{" "}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
