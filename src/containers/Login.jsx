import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Cookie from "js-cookie";
import axios from "axios/index";
import Formsy from "formsy-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { API_END_POINT } from "../config";
import firebase from "firebase";
import { connectFirebase, getAllOfCollection } from "../backend/utility";
import { FormatListNumberedOutlined } from "@material-ui/icons";
import { login } from "../api/services/User";

const style = {
  logoWrapper: {
    width: "70%",
    margin: "15px auto 0",
    height: 100 + "px",
  },
  svg: {
    width: "100%",
    fill: "#ffffff",
  },
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      email: "admin@netdesk.com",
      password: "123456",
      loading: false,
    };
  }

  async componentDidMount() {
    await connectFirebase();
  }

  async submit() {
    const { email, password } = this.state;
    const reqBody = {
      email,
      password,
    };
    if (!this.state.loading) {
      this.setState({ loading: true });
      // if (email === "admin@netdesk.com" && password === "123456") {
      if (email && password) {
        // if (email && password) {
        // const user = await login(reqBody);
        // if(user) {
        //   this.props.history.push('/')
        // }
        // debugger
        let res = await login(reqBody);
        if (res.data) {
          let user = res.data;
          localStorage.setItem('user', JSON.stringify(user));
          console.log(localStorage.getItem("user"));
          Cookie.set("token", user);
          this.props.history.push("/");
        }
      } else {
        this.setState({ loading: false });
        alert("Please use an admin user to login!");
      }

      // let data = await getAllOfCollection("admin");
      // console.log("My data = ", data);
      // let success = false;
      // for (let i = 0; i < data.length; i++) {
      //   if (email == data[i].email && password == data[i].password) {
      //     console.log("You are all set to go to next screen");
      //     success = true;
      //     break;
      //   }
      // }
      // if (success) {
      //   Cookie.set("clobberswap_access_token", email, {
      //     expires: 14,
      //   });
      //   this.setState({ loading: false });
      //   this.props.history.push("/");
      // } else {
      //   alert("Email or password is incorrect");
      //   this.setState({ loading: false });
      // }
      // axios
      //   .post(`${API_END_POINT}/api/login`, reqBody)
      //   .then((response) => {
      //     console.log("####", response);
      //     if (response && response.status == 200) {
      //       const token = response.data.Authorization_Token;
      //       console.log("Token", token);
      //       axios.defaults.headers.common["Authorization"] = `${token}`;
      //       if (process.env.NODE_ENV === "production") {
      //         Cookie.set("clobberswap_access_token", `${token}`, {
      //           expires: 14,
      //         });
      //       } else {
      //         Cookie.set("clobberswap_access_token", `${token}`, {
      //           expires: 14,
      //         });
      //       }
      //       this.props.history.push("/");
      //       // window.location.href = ("/");
      //     }
      //   })
      //   .catch((error) => {
      //     this.setState({ loading: false });
      //     window.alert("ERROR !!!");
      //   });
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center animated fadeIn login">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <Formsy onValidSubmit={this.submit.bind(this)}>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="email"
                          placeholder="Email"
                          required
                          ref={(input) => (this.email = input)}
                          onChange={(e) =>
                            this.setState({ email: e.target.value })
                          }
                          value={this.state.email}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          required
                          ref={(input) => (this.password = input)}
                          onChange={(e) =>
                            this.setState({ password: e.target.value })
                          }
                          value={this.state.password}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="roomy-blue"
                            className={`px-4 ${
                              this.state.loading ? "disabled" : ""
                            }`}
                          >
                            <i
                              className={`fa fa-spinner fa-pulse ${
                                this.state.loading ? "" : "d-none"
                              }`}
                            />{" "}
                            Login
                          </Button>
                        </Col>
                        {/*<Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>*/}
                      </Row>
                    </Formsy>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-roomy-blue py-5 d-md-down-none"
                  style={{ width: 44 + "%" }}
                >
                  <CardBody className="text-center">
                    <div>
                      <div
                        style={style.logoWrapper}
                        className={`svg-logo`}
                        // style={{ borderRadius: 4 }}
                      >
                        {/* <img
                          className={`companyLogo`}
                          src={`${require("panzer.png")}`}
                        /> */}
                      </div>
                      <div
                        className={`text-center`}
                        style={{
                          fontSize: "20px",
                          paddingTop: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Network Desk Dashboard
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

// Login.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setUser: (user) => {
//       dispatch({ payload: user });
//     },
//   };
// };

export default withRouter(connect()(Login));
