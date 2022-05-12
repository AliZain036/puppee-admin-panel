import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import Stats from "../containers/Stats";
import { Container } from "reactstrap";

import UserDetails from "./UserDetails";
import ViewOrders from "./ViewOrders";
import CustomerDetails from "./CustomerDetails";
import DriverDetails from "./DriverDetails";

import Chats from "./Chats";
import ChatDetails from "./ChatDetails";
import Customers from "./Customers";
import Posts from "./Posts";
import ViewPosts from "./ViewPosts";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import CookiePolicy from "./CookiePolicy";
import About from "./About";
import Referal from "./Referal";
import ViewReferal from "./ViewReferals";
import Languages from "./Languages";
import Companies from "./Companies";
import Expertise from "./Expertise";
import AddLanguage from "./AddLanguage";
import AddCompany from "./AddCompany";
import AddExpertise from "./AddExpertise";
import ExpertiseCategories from "./ExpertiseCategories";
import AddExpertiseCategory from "./AddExpertiseCategory";
import AssociateCompany from "./AssociateCompany";
import AssociatedCompanies from "./AssociatedCompanies";

import Rides from "./Rides";
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null,
      displayLoading: true,
      displayApp: false,
      displayMessage: "Loading User Data...",
    };
  }

  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} user={this.state.user} />
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route
                  exact={true}
                  path="/userdetails/:userId"
                  component={UserDetails}
                />
                <Route
                  exact={true}
                  path="/viewOrder/:orderId"
                  component={ViewOrders}
                />
                <Route
                  exact={true}
                  path="/viewOrderCustomer/:orderId/:customerId"
                  component={CustomerDetails}
                />
                <Route exact={true} path="/chats" component={Chats} />
                <Route
                  exact={true}
                  path="/chatDetails/:userId"
                  component={ChatDetails}
                />
                <Route
                  exact={true}
                  path="/viewOrderDriver/:orderId/:driverId"
                  component={DriverDetails}
                />
                <Route
                  exact={true}
                  path="/terms"
                  component={TermsAndConditions}
                />
                <Route exact={true} path="/cookie" component={CookiePolicy} />
                <Route exact={true} path="/privacy" component={PrivacyPolicy} />
                <Route exact={true} path="/companies" component={Companies} />
                <Route exact={true} path="/addCompany" component={AddCompany} />
                <Route
                  exact={true}
                  path="/expertiseCategories"
                  component={ExpertiseCategories}
                />
                <Route
                  exact={true}
                  path="/addExpertiseCategories"
                  component={AddExpertiseCategory}
                />
                <Route exact={true} path="/languages" component={Languages} />
                <Route
                  exact={true}
                  path="/addLanguage"
                  component={AddLanguage}
                />
                <Route exact={true} path="/expertise" component={Expertise} />
                <Route
                  exact={true}
                  path="/addExpertise/:name"
                  component={AddExpertise}
                />
                <Route
                  exact={true}
                  path="/associateCompany/:name"
                  component={AssociateCompany}
                />{" "}
                <Route
                  exact={true}
                  path="/associatedCompanies"
                  component={AssociatedCompanies}
                />
                <Route exact={true} path="/about" component={About} />
                <Route exact={true} path="/customers" component={Customers} />
                <Route exact={true} path="/posts" component={Posts} />
                <Route
                  exact={true}
                  path="/viewposts/:postId"
                  component={ViewPosts}
                />
                <Route exact={true} path="/referal" component={Referal} />
                <Route
                  exact={true}
                  path="/referal/:refId"
                  component={ViewReferal}
                />
                <Route exact={true} path="/" component={Stats} />
              </Switch>
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default withRouter(connect(mapStateToProps)(App));
