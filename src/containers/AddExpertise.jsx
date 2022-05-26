import React from "react";
import { Button } from "reactstrap";
import SwalAutoHide from "sweetalert2";
import { addUpdateData, getAllData, getDataById } from "../backend/utility";

export default class AddExpertise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      category: {},
      categories: [],
      category_id: null,
      expertise: null,
    };
  }

  async componentDidMount() {
    if (this.props.match.params.expertise_id) {
      let { expertise_id } = this.props.match.params;
      this.getSingleExpertise(expertise_id);
    }
    let result = await getAllData("show-categories");
    if (result && result.data) {
      let category = result.data.find(
        (el) => el.id === +this.props.match.params.id
      );
      this.setState({ category, categories: result.data });
    }
  }

  async getSingleExpertise(id) {
    let reqBody = {
      expertise_id: id,
    };
    let expertise = await getDataById("show-single-expertise", reqBody);
    if (expertise.data) {
      this.setState({
        expertise: expertise.data,
        category_id: expertise.data.category_id,
        description: expertise.data.name,
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    let { id } = this.props.match.params;
    let reqBody = {
      name: this.state.description,
      category_id: id ? id : this.state.category_id,
    };
    let result, message;
    if (this.state.expertise) {
      reqBody.category_id = +this.state.category_id;
      reqBody.expertise_id = this.state.expertise.id;
      result = await addUpdateData("update-expertise", reqBody);
      if (result.data) {
        message = "Expertise has been updaed successfully";
      }
    } else {
      result = await addUpdateData("add-expertise", reqBody);
      if (result.data) {
        message = "New expertise has been added successfully";
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
      this.props.history.push("/expertise");
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

  async handleCategoryChange(e) {
    this.setState({ category_id: e.target.value });
  }

  render() {
    console.log(this.state.category_id);
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="space-1">
            <div>
              <h3>
                Add New Expertise{" "}
                {this.state.category && " to " + this.state.category.name}{" "}
              </h3>
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
                        onSubmit={(e) => {
                          this.handleSubmit(e);
                        }}
                      >
                        <div className="form-group row">
                          <label className="control-label col-md-2 col-sm-2">
                            Name
                          </label>
                          <div className="col-md-4 col-sm-12">
                            <input
                              required
                              type="text"
                              name="description"
                              placeholder="Add Expertise"
                              className="form-control"
                              value={this.state.description}
                              onChange={(e) => {
                                this.setState({
                                  description: e.target.value,
                                });
                              }}
                            />
                          </div>
                          {!this.state.category && (
                            <div
                              className={`form-group col-xs-12 col-sm-12 ${
                                this.state.category ? "col-md-8" : "col-md-4"
                              }`}
                            >
                              <select
                                className="form-control"
                                onChange={(e) => this.handleCategoryChange(e)}
                                id="exampleSelect"
                                value={this.state.category_id || ""}
                              >
                                {this.state.categories &&
                                  this.state.categories.map((item) => {
                                    return (
                                      <option key={item.id} value={item.id}>
                                        {item.name}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                          )}
                          <div className="col-md-2 col-sm-12 text-right">
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
