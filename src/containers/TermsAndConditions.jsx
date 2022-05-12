import React from "react";
import "draft-js/dist/Draft.css";
import "./style.css";
import {
  addUpdateData,
  getAllData,
} from "../backend/utility";
import SwalAutoHide from "sweetalert2";

export default class TermsAndConditions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      description: "",
    };
  }

  componentDidMount() {
      this.getTermsAndConditions()
  }

  async getTermsAndConditions() {
    let result = await getAllData("show-terms-conditions");
    if(result) {
      this.setState({description: result.data.description})
    }
  }

  async updateTerms() {
    let reqBody = {
      description: this.state.description
    }
    let result = await addUpdateData("add-terms-conditions", reqBody);
    debugger;
    if(result) {
      this.setState({description: result.data.description})
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: "Terms and Conditions Updated Successfully",
      });
    } else {
      SwalAutoHide.fire({
        icon: "error",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: "Something went wrong!!",
      });
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-12"></div>
            <textarea
              value={this.state.description}
              onChange={(e) => {
                this.setState({
                  description: e.target.value,
                });
              }}
              style={{ minHeight: 300, marginBottom: 20, width: "100%" }}
            />
            <button
              onClick={() => this.updateTerms()}
              className={`btn btn-sm btn-success`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}
