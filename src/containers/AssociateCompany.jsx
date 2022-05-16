import React from "react";
import { Button } from "reactstrap";
import SwalAutoHide from "sweetalert2";
import {
  addUpdateData,
  getAllData,
} from "../backend/utility";
// import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
const token = Cookie.get("clobberswap_access_token");

export default class AssociateCompany extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: {},
      companyName: ""
    };
  }

  componentDidMount() {
    let {category} = this.props.location.state
    this.setState({ category })
  }

  async handleSubmit(e) {
    e.preventDefault()
    let reqBody = {
      name: this.state.companyName,
      category_id: this.state.category.id
    }
    let result = await addUpdateData("associate-company", reqBody);
    if(result.data) {
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: "Associate Company Added Successfully!",
      });
      this.props.history.push("/associatedCompanies");
    } else {
      SwalAutoHide.fire({
        icon: "error",
        timer: 2000,
        title: "Failed.",
        showConfirmButton: false,
        text: "Something went wrong!",
      });
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Add New Entry to {this.props.match.params.name}</h3>
            </div>
          </div>

          <div className="row animated fadeIn">
            <div className="col-12">
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="x_panel">
                    <div className="x_content">
                      <br />
                      <form
                        id="demo-form2"
                        data-parsley-validate
                        className="form-horizontal form-label-left"
                        onSubmit={(e) => { this.handleSubmit(e) }}
                      >
                        <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">
                            Name
                          </label>
                          <div className="col-md-8 col-sm-8">
                            <div className="col-md-8 col-sm-8">
                              <input
                                required
                                type="text"
                                name="name"
                                placeholder="Add Associate Company"
                                className="form-control"
                                value={this.state.companyName}
                                onChange={(e) => {
                                  this.setState({
                                    companyName: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-1 col-sm-1">
                            <Button className="btn btn-success btn-md">
                              {" "}
                              Submit
                            </Button>
                          </div>
                        </div>
                        <div className="ln_solid" />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
