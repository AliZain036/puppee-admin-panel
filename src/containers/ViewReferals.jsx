import React from "react";
import axios from "axios";
import moment from "moment";
import { Grid } from "@material-ui/core";
import { getDataById } from "../backend/utility";

const options = {
  orientation: "portrait",
  unit: "pt",
};
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

  generatePdf() {
    // let doc = new jdPDF("p");
    var divContents = document.getElementById("referral-details").innerHTML;
    var a = window.open();
    a.document.write("<html>");
    a.document.write("<body >");
    a.document.write(divContents);
    a.document.write("</body></html>");
    a.document.close();
    a.print();
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
      fontWeight: "bold",
      marginBottom: 0,
    };

    const subHeadingStyles = {
      fontWeight: 20,
      marginTop: 0,
    };
    const agreementStyles = {
      fontWeight: 20,
      marginTop: 0,
    };
    const ref = "";
    return (
      <div
        className="animated fadeIn"
        style={{ background: "white", paddingInline: 30 }}
      >
        <div id="referral-details">
          <div className="col-md-12 px-5">
            <h3 className="pl-4">Referral Details</h3>
          </div>
          <div className="col-md-12 px-4">
            {detailedReferal && (
              <img
                src={
                  detailedReferal.user &&
                  detailedReferal.user.profile &&
                  detailedReferal.user.profile.profile_image
                }
                className="px-5"
                alt="User Profile Photo"
                height={200}
              ></img>
            )}
            <div
              className="content-sm-center content-md-center"
              ref={ref}
              id="pdf"
            >
              {detailedReferal && (
                <div className="container row px-5">
                  <div className="col-md-12 px-4">
                    <p
                      style={{
                        fontWeight: 16,
                        fontWeight: "bold",
                        marginTop: 20,
                      }}
                    >
                      Date:
                      {" " +
                        moment(new Date(detailedReferal.created_at)).format(
                          "YYYY-MM-DD"
                        )}
                    </p>
                  </div>
                  <div className="col-md-12">
                    <p
                      className="fs-16 font-weight-bold text-decoration-underline"
                      style={{
                        color: "#5ba4f4",
                      }}
                    >
                      To: Receiving Office
                    </p>
                  </div>
                  {detailedReferal.receiver && (
                    <div className="col-md-12 row">
                      <div className="col-md-6 col-xs-12 col-sm-12">
                        <p style={headingStyles} className="d-inline-block">
                          Name:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="ml-1 d-inline-block"
                        >
                          {detailedReferal.receiver.first_name +
                            " " +
                            detailedReferal.receiver.last_name}
                        </p>
                      </div>
                      <div className="col-md-6 col-xs-12 col-sm-12">
                        <p style={headingStyles} className="d-inline-block">
                          Mobile:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="ml-1 d-inline-block"
                        >
                          {" " + detailedReferal.receiver.phone_number}
                        </p>
                      </div>
                      <div className="col-md-6 col-xs-12 col-sm-12">
                        <p style={headingStyles} className="d-inline-block">
                          Email:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="d-inline-block ml-1"
                        >
                          {" " + detailedReferal.receiver.email}
                        </p>
                      </div>
                      <div className="col-md-6 col-xs-12 col-sm-12">
                        <p style={headingStyles} className="d-inline-block">
                          Website:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="d-inline-block ml-1"
                        >
                          {detailedReferal.receiver.profile &&
                          detailedReferal.receiver.profile.website
                            ? detailedReferal.receiver.profile.website
                            : "N/A"}
                        </p>
                      </div>
                      <div className="col-md-6 col-xs-12 col-sm-12">
                        <p style={headingStyles} className="d-inline-block">
                          Office Name:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="d-inline-block ml-1"
                        >
                          {detailedReferal.receiver.profile &&
                          detailedReferal.receiver.profile.company_name
                            ? detailedReferal.receiver.profile.company_name
                            : "N/A"}
                        </p>
                      </div>
                      <div className="col-md-6 col-xs-12 col-sm-12">
                        <p style={headingStyles} className="d-inline-block">
                          Office Address:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="d-inline-block ml-1"
                        >
                          {detailedReferal.receiver.profile &&
                          detailedReferal.receiver.profile.brokerage_address
                            ? detailedReferal.receiver.profile.brokerage_address
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="col-md-12">
                    <p
                      style={{
                        fontWeight: 16,
                        fontWeight: "bold",
                        color: "#5ba4f4",
                        textDecoration: "underline",
                      }}
                    >
                      From: Sender Office
                    </p>
                  </div>
                  {detailedReferal.user && (
                    <div className="col-md-12 row">
                      <div className="col-xs-12 col-md-6">
                        <p style={headingStyles} className="d-inline-block">
                          Name:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="d-inline-block ml-1"
                        >
                          {detailedReferal.user.first_name +
                            " " +
                            detailedReferal.user.last_name}
                        </p>
                      </div>
                      <div className="col-xs-12 col-md-6">
                        <p style={headingStyles} className="d-inline-block">
                          Mobile:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="d-inline-block ml-1"
                        >
                          {detailedReferal.user.profile &&
                            detailedReferal.user.profile.phone_number}
                        </p>
                      </div>
                      <div className="col-xs-12 col-md-6">
                        <p style={headingStyles} className="d-inline-block">
                          Email:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="d-inline-block ml-1"
                        >
                          {detailedReferal.user.email}
                        </p>
                      </div>
                      <div className="col-xs-12 col-md-6">
                        <p style={headingStyles} className="d-inline-block">
                          Website:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="d-inline-block ml-1"
                        >
                          {(detailedReferal.user.profile &&
                            detailedReferal.user.profile.website) ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="col-xs-12 col-md-6">
                        <p style={headingStyles} className="d-inline-block">
                          Office Name:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="d-inline-block ml-1"
                        >
                          {(detailedReferal.user.profile &&
                            detailedReferal.user.profile.company_name) ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="col-xs-12 col-md-6">
                        <p style={headingStyles} className="d-inline-block">
                          Office Address:
                        </p>
                        <p
                          style={subHeadingStyles}
                          className="d-inline-block ml-1"
                        >
                          {(" " + detailedReferal.user.profile &&
                            detailedReferal.user.profile.brokerage_address) ||
                            " N/A"}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="col-md-12">
                    <p
                      style={{
                        fontWeight: 16,
                        fontWeight: "bold",
                        color: "#5ba4f4",
                        textDecoration: "underline",
                      }}
                    >
                      Buyer / Seller Information
                    </p>
                  </div>
                  <div className="col-md-12 row">
                    <div className="col-xs-12 col-md-6">
                      <p style={headingStyles} className="d-inline-block">
                        Name:
                      </p>
                      <p
                        style={subHeadingStyles}
                        className="d-inline-block ml-1"
                      >
                        {detailedReferal.name}
                      </p>
                    </div>
                    <div className="col-xs-12 col-md-6">
                      <p style={headingStyles} className="d-inline-block">
                        Mobile:
                      </p>
                      <p
                        style={subHeadingStyles}
                        className="d-inline-block ml-1"
                      >
                        {detailedReferal.phone}
                      </p>
                    </div>
                    <div className="col-xs-12 col-md-6">
                      <p style={headingStyles} className="d-inline-block">
                        Email:
                      </p>
                      <p
                        style={subHeadingStyles}
                        className="d-inline-block ml-1"
                      >
                        {detailedReferal.email || "N/A"}
                      </p>
                    </div>
                    <div className="col-xs-12 col-md-6">
                      <p style={headingStyles} className="d-inline-block">
                        Property Type:
                      </p>
                      <p
                        style={subHeadingStyles}
                        className="d-inline-block ml-1"
                      >
                        {detailedReferal.property_type}
                      </p>
                    </div>
                    <div className="col-xs-12 col-md-6">
                      <p style={headingStyles} className="d-inline-block">
                        Property Address:
                      </p>
                      <p
                        style={subHeadingStyles}
                        className="d-inline-block ml-1"
                      >
                        {detailedReferal.property_address}
                      </p>
                    </div>
                    <div className="col-xs-12 col-md-6">
                      <p style={headingStyles} className="d-inline-block">
                        Desired Price Range:
                      </p>
                      <p
                        style={subHeadingStyles}
                        className="d-inline-block ml-1"
                      >
                        {" " +
                          detailedReferal.min_price +
                          " - " +
                          detailedReferal.max_price}
                      </p>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-12">
                    <p
                      style={{
                        fontWeight: 16,
                        fontWeight: "bold",
                        color: "#5ba4f4",
                        textDecoration: "underline",
                      }}
                    >
                      Referral Acceptance and Acknowledgments
                    </p>
                    <p className="m-0" style={agreementStyles}>
                      I {detailedReferal.name}, do hereby accept this refferal
                      and agree to bound the following terms and conditions.{" "}
                      <b>Agreed</b>:{" "}
                      {" " + detailedReferal.referral_agreement + "%"}
                    </p>
                  </div>
                  <div className="col-xs-12 col-md-12">
                    <p
                      style={{
                        fontWeight: 16,
                        fontWeight: "bold",
                        color: "#5ba4f4",
                        textDecoration: "underline",
                      }}
                    >
                      Additional Terms and Condition
                    </p>
                    <p style={agreementStyles}>
                      All payments must be mailed by cheque not later than 7
                      days following the final completion of the sale
                    </p>
                  </div>
                  <div className="col-xs-12 col-md-12">
                    <p style={headingStyles}>
                      Disclaimer: NetworkDesk will not be held responsible for
                      any claims or legitation that may result from this
                      agreement
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pl-5 ml-4">
          <button
            className="my-3"
            style={{
              background: "rgb(81, 173, 246)",
              color: "white",
              borderRadius: 20,
              height: 35,
              border: "1px solid rgb(81, 173, 246)",
            }}
            onClick={this.generatePdf}
          >
            Generate pdf
          </button>
        </div>
      </div>
    );
  }
}
