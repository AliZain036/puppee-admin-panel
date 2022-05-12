import React from "react";
import Cookie from "js-cookie";
import {
  getAllData,
} from "../backend/utility";

export default class Area extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      programs: [],
      userCount: 0,
      postCount: 0,
      refCount: 0,
    };
  }

  async componentDidMount() {
    if (Cookie.get("token")) {
      let allUsers = await getAllData("show-users");
      let allPosts = await getAllData("show-all-posts");
      let allReferrals = await getAllData("get-referrals");

      this.setState({
        userCount: allUsers.data && allUsers.data.length,
        postCount: allPosts && allPosts.data.data.length,
        refCount: allReferrals.data && allReferrals.data.length,
      });
    } else {
      this.props.history.push("/login");
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-sm-4"></div>
            <div className="col-sm-4 pull-right mobile-space"></div>
          </div>
          <div className="text-center space-2"></div>
          <div className="row space-1">
            <div className="col-sm-6">
              <h3 className="space-1">Total Users</h3>
              <h5>{this.state.userCount}</h5>
            </div>
            <div className="col-sm-6 ">
              <h3 className="space-1">Total Posts</h3>
              <h5>{this.state.postCount}</h5>
            </div>
            <div className="col-sm-6 ">
              <h3 className="space-1">Total Referrals</h3>
              <h5>{this.state.refCount}</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
