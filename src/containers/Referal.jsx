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
import firebase from "firebase";
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
      transactions: [],
      copyTransactions: [],
    };
  }
  async componentWillMount() {
    if (firebase.auth().currentUser) {
      let allUsers = await getAllOfCollection("Users");
      this.setState({ allUsers: allUsers });
      let allTransactions = await getAllOfCollection("Transactions");
      console.log("THis is", allTransactions);
      this.setState({
        transactions: allTransactions,
        copyTransactions: allTransactions,
      });
    } else {
      this.props.history.push("/login");
    }
  }

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

            {/* <div className="col-sm-4 pull-right mobile-space">
              <Link to="colors/colors-form">
                <button type="button" className="btn btn-success">
                  Add new Referral
                </button>
              </Link>
            </div> */}
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
                    var creator = this.getUserByID(trans.creator);
                    var receiver = this.getUserByID(trans.receiver);
                    return (
                      <tr>
                        <td>{index}</td>
                        <td>{trans.clientName}</td>
                        <td>{trans.propertyType}</td>

                        <td style={{ cursor: "pointer", color: "black" }}>
                          <Link
                            style={{ color: "black" }}
                            to={`/userdetails/${trans.creator}`}
                          >
                            {creator &&
                              creator.firstname + " " + creator.lastname}
                          </Link>
                        </td>
                        <td style={{ cursor: "pointer", color: "black" }}>
                          {receiver != "" ? (
                            <Link
                              style={{ color: "black" }}
                              to={`/userdetails/${trans.receiver}`}
                            >
                              {receiver.firstname + " " + receiver.lastname}
                            </Link>
                          ) : (
                            trans.receiver
                          )}
                        </td>
                        <td>27-November-2020</td>
                        <td>{trans.status}</td>
                        <td>
                          <Link to={`/referal/${trans.transaction_id}`}>
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
