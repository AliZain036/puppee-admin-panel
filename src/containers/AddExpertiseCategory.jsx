import React from "react";
import { Button } from "reactstrap";
import SwalAutoHide from "sweetalert2";
import {
  addUpdateData,
} from "../backend/utility";

export default class AddExpertiseCategory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newExpertiseCategory: "",
      active: true,
    };
  }

  async handleSubmit(e) {
    e.preventDefault();
    let reqBody = {
      name: this.state.newExpertiseCategory,
      status: this.state.active,
    };
    let result = await addUpdateData("add-category", reqBody);
    if (result && result.data) {
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: "New Category Added Sucessfully!",
      });
      this.props.history.push("expertiseCategories");
    } else {
      SwalAutoHide.fire({
        icon: "error",
        timer: 2000,
        title: "Failed.",
        showConfirmButton: false,
        text: "Something Went Wrong!",
      });
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Add New Expertise Category</h3>
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
                                placeholder="Add New Category"
                                className="form-control"
                                style={{ width: "95%" }}
                                value={this.state.newLanguage}
                                onChange={(e) => {
                                  this.setState({
                                    newExpertiseCategory: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <label className="control-label col-md-3 col-sm-3">
                            Active
                          </label>
                          <div className="col-md-8 col-sm-8">
                            <div className="col-md-8 col-sm-8">
                              <input
                                type="checkbox"
                                onChange={() => {
                                  this.setState({ active: !this.state.active });
                                }}
                                checked={this.state.active}
                              ></input>
                            </div>
                          </div>
                          <div className="col-md-1 col-sm-1">
                            <Button
                              className="btn btn-success btn-md"
                              type="submit"
                            >
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
