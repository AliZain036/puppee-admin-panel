import React from "react";
import { Button } from "reactstrap";
import SwalAutoHide from "sweetalert2";
import { addUpdateData, getAllData } from "../backend/utility";

export default class AddExpertise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      category: {},
    };
  }

  async componentDidMount() {
    let result = await getAllData("show-categories");
    if (result && result.data) {
      let category = result.data.find(
        (el) => el.id === +this.props.match.params.id
      );
      this.setState({ category });
    }
  }

  async handleSubmit(e) {
    e.preventDefault()
    let reqBody = {
      name: this.state.description,
      category_id: this.state.category.id,
    };
    let result = await addUpdateData("add-expertise", reqBody);
    if (result && result.data) {
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: "New Expertise Successfully!",
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

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="space-1">
            <div>
              <h3>
                Add New Expertise to Category:{" "}
                {" " + this.state.category && this.state.category.name}
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
                          <label className="control-label col-md-3 col-sm-3">
                            Name
                          </label>
                          <div className="col-md-8 col-sm-8">
                            <div className="col-md-8 col-sm-8">
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
