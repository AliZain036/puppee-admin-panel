import React from "react";
import { Button } from "reactstrap";
import SwalAutoHide from "sweetalert2";
import { addUpdateData, getDataById } from "../backend/utility";

export default class AddCompany extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      companyName: "",
      company: {},
      company_id: null,
    };
  }

  componentDidMount() {
    if (this.props.match.params.company_id) {
      let { company_id } = this.props.match.params;
      this.getCompany(company_id);
    }
  }

  async getCompany(company_id) {
    try {
      let reqBody = {
        company_id: company_id
      }
      let response = await getDataById("show-company", reqBody);
      if(response.data) {
        this.setState({ company: response.data, company_id: response.data.id, companyName: response.data.name })
      }
    } catch (error) {
      SwalAutoHide.fire({
        icon: "error",
        timer: 2000,
        title: "Failed.",
        showConfirmButton: false,
        text: "Something Went Wrong!",
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    let reqBody = {
      name: this.state.companyName,
    };
    let result, message;
    if(this.state.company_id !== null) {
      reqBody.company_id = this.state.company_id;
      result = await addUpdateData("update-company", reqBody);
      if(result.data) {
        message = "Company has been updated"
      }
    } else {
      result = await addUpdateData("add-company", reqBody);
      if(result.data) {
        message = "New company added successfully"
      }
    }
    if (result.data) {
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: message,
      });
      this.props.history.push("/companies");
    } else {
      SwalAutoHide.fire({
        icon: "error",
        timer: 2000,
        title: "Failed.",
        showConfirmButton: false,
        text: "Something went wrong",
      });
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Add New Company</h3>
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
                        onSubmit={(e) => this.handleSubmit(e)}
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
                                placeholder="Add Company"
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
