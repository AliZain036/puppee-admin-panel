import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter, BrowserRouter as Router } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import Stats from "../containers/Stats";
import { Container } from "reactstrap";

import UserDetails from "./UserDetails";
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
import Login from "./Login";
import UpdateUser from "./UpdateUser";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
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
              {/* <Router> */}
              <Switch>
                <Route
                  exact
                  path="/userdetails/:userId"
                  component={UserDetails}
                />
                <Route
                  exact
                  path="/updateUser/:userId"
                  component={UpdateUser}
                />
                <Route exact path="/terms" component={TermsAndConditions} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/cookie" component={CookiePolicy} />
                <Route exact path="/privacy" component={PrivacyPolicy} />
                <Route exact path="/companies" component={Companies} />
                <Route exact path="/addCompany" component={AddCompany} />
                <Route
                  exact
                  path="/updateCompany/:company_id"
                  component={AddCompany}
                />
                <Route
                  exact
                  path="/expertiseCategories"
                  component={ExpertiseCategories}
                />
                <Route
                  exact
                  path="/addExpertiseCategories"
                  component={AddExpertiseCategory}
                />
                <Route
                  exact
                  path="/updateCategory"
                  component={AddExpertiseCategory}
                />
                <Route exact path="/languages" component={Languages} />
                <Route exact path="/addLanguage" component={AddLanguage} />
                <Route exact path="/updateLanguage/:language_id" component={AddLanguage} />
                <Route exact path="/expertise" component={Expertise} />
                <Route
                  exact
                  path="/addExpertise/:id"
                  component={AddExpertise}
                />
                <Route
                  exact
                  path="/updateExpertise/:expertise_id"
                  component={AddExpertise}
                />
                <Route exact path="/addExpertise" component={AddExpertise} />
                <Route
                  exact
                  path="/associateCompany/:name"
                  component={AssociateCompany}
                />{" "}
                <Route
                  exact
                  path="/associatedCompanies"
                  component={AssociatedCompanies}
                />
                {/* <Route
                    exact
                    path="/addAssociatedCompanies"
                    component={}
                  /> */}
                <Route exact path="/about" component={About} />
                <Route exact path="/customers" component={Customers} />
                <Route exact path="/posts" component={Posts} />
                <Route exact path="/viewposts/:postId" component={ViewPosts} />
                <Route exact path="/referal" component={Referal} />
                <Route exact path="/referal/:refId" component={ViewReferal} />
                <Route exact path="/" component={Stats} />
                <Route path="/*" name="Stats" component={Stats} />
              </Switch>
              {/* </Router> */}
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
