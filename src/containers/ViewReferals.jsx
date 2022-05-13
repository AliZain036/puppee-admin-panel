import React from "react";
import axios from "axios";
import moment from "moment";
import { Grid } from "@material-ui/core";
import { API_END_POINT } from "../config";
import { getDataById } from "../backend/utility";
import ReactToPdf from "react-to-pdf";
export default class ViewReferals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: [],
      detailedReferal: null,
      allUsers: [],
    };
  }

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

  render() {
    const { detailedReferal } = this.state;
    const headingStyles = {
      fontWeight: 16,
      fontWeight: "bold",
      marginLeft: 10,
      marginBottom: 0,
    };

    const subHeadingStyles = {
      fontWeight: 20,
      marginTop: 0,
      marginLeft: 10,
    };
    const agreementStyles = {
      fontWeight: 20,
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
                      detailedReferal.user &&
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
                    Date:
                    {moment(new Date(detailedReferal.created_at)).format(
                      "YYYY-MM-DD"
                    )}
                    {/* {moment(
                      new Date(Date.UTC(1970, 0, 1)).setUTCSeconds(
                        detailedReferal.created_at
                      )
                    ).format("MMMM DD YYYY")} */}
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
                {detailedReferal.user && (
                  <div>
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
                      <p style={subHeadingStyles}>
                        {detailedReferal.user.email}
                      </p>
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
                    Agreed: {" " + detailedReferal.referral_agreement + "%"}
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
                <Grid item md={12} xs={12}>
                  {detailedReferal && (
                    <ReactToPdf
                      targetRef={document.getElementById("pdf")}
                      filename="Refferal.pdf"
                    >
                      {({ toPdf }) => (
                        <button
                          className="my-3"
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
                </Grid>
              </Grid>
            )}
          </div>
        </div>
      </div>
    );
  }
}
