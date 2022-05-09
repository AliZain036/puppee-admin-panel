import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pagination, Image } from "react-bootstrap";
import moment from "moment";
import { Grid, makeStyles } from "@material-ui/core";
import { API_END_POINT } from "../config";
import {
  connectFirebase,
  getAllOfCollection,
  getData,
  getDataById,
} from "../backend/utility";
import ReactToPdf from "react-to-pdf";
import HasRole from "../hoc/HasRole";
export default class ViewReferals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      activePage: 1,
      pages: 1,
      q: "",
      responseMessage: "Loading Colors...",
      eventDetail: {},
      transactions: [],
      detailedReferal: null,
      allUsers: [],
    };
  }

  getUserByID = (id) => {
    var myUser = "";
    this.state.allUsers.map((user) => {
      if (user.id === id) {
        myUser = user;
      }
    });
    // console.log("This is user", myUser);
    return myUser;
  };

  async componentDidMount() {
    this.getReferralDetails();
  }

  async getReferralDetails() {
    let reqBody = {
      referral_id: this.props.match.params.refId,
    };
    let result = await getDataById("referral-details", reqBody);
    if (result) {
      this.setState({ detailedReferal: result.data });
    }
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
    const { detailedReferal } = this.state;
    const headingStyles = {
      fontWeight: 16,
      fontWeight: "bold",
      // color: "#5ba4f4",
      // textDecoration: "underline",
      marginLeft: 10,
      marginBottom: 0,
    };

    const subHeadingStyles = {
      fontWeight: 20,
      // fontWeight: "bold",
      marginTop: 0,
      marginLeft: 10,
    };
    const agreementStyles = {
      fontWeight: 20,
      // fontWeight: "bold",
      marginTop: 0,
      marginLeft: 10,
      width: "80%",
    };
    const ref = "";
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Referral Details</h3>
            </div>
          </div>
          <div
            className="row content-sm-left content-md-left"
            ref={ref}
            id="pdf"
            // style={{ width: 800 }}
          >
            {detailedReferal && (
              <Grid
                container
                direction="row"
                style={{ background: "white", paddingInline: 30 }}
              >
                <Grid item md={8} xs={8}>
                  <img
                    src={
                      detailedReferal.user.profile &&
                      detailedReferal.user.profile.profile_image
                    }
                  ></img>
                </Grid>
                <Grid item md={4} xs={4}>
                  <p
                    style={{
                      fontWeight: 16,
                      fontWeight: "bold",
                      marginTop: 20,
                    }}
                  >
                    Date
                    {moment(
                      new Date(Date.UTC(1970, 0, 1)).setUTCSeconds(
                        detailedReferal.created_at.seconds
                      )
                    ).format("MMMM DD YYYY")}
                  </p>
                </Grid>
                <div
                  style={{
                    width: "100%",
                    border: "1px solid #5ba4f4",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                ></div>
                <Grid item md={12} xs={12}>
                  <p
                    style={{
                      fontWeight: 16,
                      fontWeight: "bold",
                      color: "#5ba4f4",
                      textDecoration: "underline",
                      marginLeft: 10,
                    }}
                  >
                    To: Receiving Office
                  </p>
                </Grid>
                {detailedReferal.receiver && (
                  <div>
                    <Grid item md={6} xs={6}>
                      <p style={headingStyles}>Name</p>
                      <p style={subHeadingStyles}>
                        {detailedReferal.receiver.first_name +
                          " " +
                          detailedReferal.receiver.last_name}
                      </p>
                    </Grid>
                    <Grid item md={4} xs={4}>
                      <p style={headingStyles}>Mobile</p>
                      <p style={subHeadingStyles}>
                        {detailedReferal.receiver.phone_number}
                      </p>
                    </Grid>
                    <Grid item md={6} xs={6}>
                      <p style={headingStyles}>Email</p>
                      <p style={subHeadingStyles}>
                        {detailedReferal.receiver.email}
                      </p>
                    </Grid>
                    <Grid item md={4} xs={4}>
                      <p style={headingStyles}>Website</p>
                      <p style={subHeadingStyles}>
                        {(detailedReferal.receiver.profile &&
                          detailedReferal.receiver.profile.website) ||
                          "N/A"}
                      </p>
                    </Grid>
                    <Grid item md={6} xs={6}>
                      <p style={headingStyles}>Office Name</p>
                      <p style={subHeadingStyles}>
                        {(detailedReferal.receiver.profile &&
                          detailedReferal.receiver.profile.company_name) ||
                          "N/A"}
                      </p>
                    </Grid>
                    <Grid item md={4} xs={4}>
                      <p style={headingStyles}>Office Address</p>
                      <p style={subHeadingStyles}>
                        {(detailedReferal.receiver.profile &&
                          detailedReferal.receiver.profile.brokerage_address) ||
                          "N/A"}
                      </p>
                    </Grid>
                  </div>
                )}

                <Grid item md={12} xs={12}>
                  <p
                    style={{
                      fontWeight: 16,
                      fontWeight: "bold",
                      color: "#5ba4f4",
                      textDecoration: "underline",
                      marginLeft: 10,
                    }}
                  >
                    From: Sender Office
                  </p>
                </Grid>
                <Grid item md={6} xs={6}>
                  <p style={headingStyles}>Name</p>
                  <p style={subHeadingStyles}>
                    {detailedReferal.user.first_name +
                      " " +
                      detailedReferal.user.last_name}
                  </p>
                </Grid>
                <Grid item md={4} xs={4}>
                  <p style={headingStyles}>Mobile</p>
                  <p style={subHeadingStyles}>
                    {detailedReferal.user.profile &&
                      detailedReferal.user.profile.phone_number}
                  </p>
                </Grid>
                <Grid item md={6} xs={6}>
                  <p style={headingStyles}>Email</p>
                  <p style={subHeadingStyles}>{detailedReferal.user.email}</p>
                </Grid>
                <Grid item md={4} xs={4}>
                  <p style={headingStyles}>Website</p>
                  <p style={subHeadingStyles}>
                    {(detailedReferal.user.profile &&
                      detailedReferal.user.profile.website) ||
                      "N/A"}
                  </p>
                </Grid>
                <Grid item md={6} xs={6}>
                  <p style={headingStyles}>Office Name</p>
                  <p style={subHeadingStyles}>
                    {(detailedReferal.user.profile &&
                      detailedReferal.user.profile.company_name) ||
                      "N/A"}
                  </p>
                </Grid>
                <Grid item md={4} xs={4}>
                  <p style={headingStyles}>Office Address</p>
                  <p style={subHeadingStyles}>
                    {(detailedReferal.user.profile &&
                      detailedReferal.user.profile.brokerage_address) ||
                      "N/A"}
                  </p>
                </Grid>

                <Grid item md={12} xs={12}>
                  <p
                    style={{
                      fontWeight: 16,
                      fontWeight: "bold",
                      color: "#5ba4f4",
                      textDecoration: "underline",
                      marginLeft: 10,
                    }}
                  >
                    Buyer / Seller Information
                  </p>
                </Grid>
                <Grid item md={6} xs={6}>
                  <p style={headingStyles}>Name</p>
                  <p style={subHeadingStyles}>{detailedReferal.name}</p>
                </Grid>
                <Grid item md={4} xs={4}>
                  <p style={headingStyles}>Mobile</p>
                  <p style={subHeadingStyles}>{detailedReferal.phone}</p>
                </Grid>
                <Grid item md={6} xs={6}>
                  <p style={headingStyles}>Email</p>
                  <p style={subHeadingStyles}>
                    {detailedReferal.email || "N/A"}
                  </p>
                </Grid>
                <Grid item md={4} xs={4}>
                  <p style={headingStyles}>Property Type</p>
                  <p style={subHeadingStyles}>
                    {detailedReferal.property_type}
                  </p>
                </Grid>
                <Grid item md={6} xs={6}>
                  <p style={headingStyles}>Property Address</p>
                  <p style={subHeadingStyles}>
                    {detailedReferal.property_address}
                  </p>
                </Grid>
                <Grid item md={4} xs={4}>
                  <p style={headingStyles}>Desired Price Range</p>
                  <p style={subHeadingStyles}>
                    {detailedReferal.min_price +
                      " - " +
                      detailedReferal.max_price}
                  </p>
                </Grid>
                <Grid item md={12} xs={12}>
                  <p
                    style={{
                      fontWeight: 16,
                      fontWeight: "bold",
                      color: "#5ba4f4",
                      textDecoration: "underline",
                      marginLeft: 10,
                    }}
                  >
                    Referral Acceptance and Acknowledgments
                  </p>
                  <p style={agreementStyles}>
                    I {detailedReferal.name}, do hereby accept this refferal and
                    agree to bound the following terms and conditions.
                  </p>
                  <p style={subHeadingStyles}>
                    {detailedReferal.referral_agreement}
                  </p>
                </Grid>
                <Grid item md={12} xs={12}>
                  <p
                    style={{
                      fontWeight: 16,
                      fontWeight: "bold",
                      color: "#5ba4f4",
                      textDecoration: "underline",
                      marginLeft: 10,
                    }}
                  >
                    Additional Terms and Condition
                  </p>
                  <p style={agreementStyles}>
                    All payments must be mailed by cheque not later than 7 days
                    following the final completion of the sale
                  </p>
                </Grid>
                <Grid item md={12} xs={12}>
                  <p style={headingStyles}>
                    Disclaimer: NetworkDesk will not be held responsible for any
                    claims or legitation that may result from this agreement
                  </p>
                </Grid>
              </Grid>
              // <div
              //   className="col-sm-10  offset-sm-1"
              //   style={{ textAlign: "left" }}
              // >
              //   <div className="row space-1">
              //     <div className="col-sm-4" style={{ textAlign: "left" }}>
              //       <h4 style={{ textAlign: "left", marginTop: "25px" }}>
              //         Client Information:
              //       </h4>
              //       <h5 style={{ textAlign: "left" }}>
              //         {detailedReferal.clientName}
              //       </h5>
              //       <h5 style={{ textAlign: "left" }}>
              //         {detailedReferal.clientPhone}
              //       </h5>
              //       <h5 style={{ textAlign: "left" }}>
              //         {detailedReferal.clientEmail}
              //       </h5>
              //       <h5 style={{ textAlign: "left" }}>
              //         {detailedReferal.additionalInfo}
              //       </h5>
              //     </div>
              //   </div>
              //   <h5 style={{ textAlign: "left", marginTop: "25px" }}>
              //     Property Type: {detailedReferal.propertyType}
              //   </h5>

              //   <h5 style={{ textAlign: "left", marginTop: "25px" }}>
              //     Sender :{" "}
              //     {detailedReferal.user.profile && detailedReferal.user.profile
              //       .firstname +
              //       " " +
              //       this.getUserByID(detailedReferal.creator)
              //         .lastname}
              //   </h5>

              //   <h5 style={{ textAlign: "left", marginTop: "25px" }}>
              //     Receiver :{" "}
              //     {this.getUserByID(detailedReferal.receiver) != ""
              //       ? this.getUserByID(detailedReferal.receiver)
              //           .firstname +
              //         " " +
              //         this.getUserByID(detailedReferal.receiver)
              //           .lastname
              //       : detailedReferal.receiver}
              //   </h5>

              //   <h5 style={{ textAlign: "left" }}>
              //     Property Location:{" "}
              //     {detailedReferal.propertyLocation}
              //   </h5>
              //   <h5 style={{ textAlign: "left" }}>
              //     Price Range: ${detailedReferal.priceRangeValues[0]}
              //     K-${detailedReferal.priceRangeValues[1]}K
              //   </h5>
              //   <h5 style={{ textAlign: "left" }}>
              //     Referral Agreement: {detailedReferal.percentage}
              //   </h5>
              //   <h5 style={{ textAlign: "left" }}>
              //     Referral Status: {detailedReferal.status}
              //   </h5>
              //   <button
              //     className={`btn btn-sm btn-primary`}
              //     style={{ marginTop: "25px" }}
              //   >
              //     Download Agreement Form
              //   </button>
              // </div>
            )}
          </div>
          {detailedReferal && (
            <ReactToPdf
              targetRef={document.getElementById("pdf")}
              filename="Refferal.pdf"
            >
              {({ toPdf }) => (
                <button
                  style={{
                    background: "rgb(81, 173, 246)",
                    color: "white",
                    borderRadius: 20,
                    height: 35,
                    border: "none",
                  }}
                  onClick={toPdf}
                >
                  Generate pdf
                </button>
              )}
            </ReactToPdf>
          )}
        </div>
      </div>
    );
  }
}
