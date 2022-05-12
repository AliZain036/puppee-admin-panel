import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  getAllData,
  searchData,
} from "../backend/utility";

export default class Referrals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      user: {},
      searchQuery: "",
    };
  }

  async componentDidMount() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.setState({ user });
    }
    let referrals = await getAllData("get-referrals");
    this.setState({ transactions: referrals.data });
  }

  async sortPostsByDate() {
    let data = await getAllData("sort-by-date-referrals");
    if(data.data.length > 0) {
      this.setState({ transactions: data.data })
    }
  };

  async handleSearch() {
    let { searchQuery } = this.state;
    searchQuery = searchQuery.trim();
    let searchResults;
    if (searchQuery.length > 0) {
      let reqBody = {
        query: searchQuery,
      };
      searchResults = await searchData("search-referrals", reqBody);
      if (searchResults.data && searchResults.data.length > 0) {
        this.setState({ transactions: searchResults.data, searchQuery: "" });
      } else {
        this.setState({ transactions: [], searchQuery: "" });
      }
    } else {
      this.componentDidMount()
    }
  }

  async sortReferralsByName() {
    let data = await getAllData("sort-by-name-referrals");
    if(data.data.length > 0) {
      this.setState({ transactions: data.data })
    }
  };

  render() {
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
                  value={this.state.searchQuery}
                  onChange={(e) =>
                    this.setState({ searchQuery: e.target.value })
                  }
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
                  this.sortReferralsByName();
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
                          {moment(new Date(trans.created_at)).format(
                            "YYYY-MM-DD"
                          )}
                        </td>
                        <td>{trans.status}</td>
                        <td>
                          <Link to={`/referal/${trans.id}`}>
                            <button className={`btn btn-sm btn-success`}>
                              View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
