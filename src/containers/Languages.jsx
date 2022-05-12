import React from "react";
import { Link } from "react-router-dom";
import Cookie from "js-cookie";
import SwalAutoHide from "sweetalert2";
import {
  getAllData,
  deleteRecord,
} from "../backend/utility";
export default class Languages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      languages: [],
    };
  }
  async componentDidMount() {
    if (Cookie.get("token")) {
      this.getLanguages()
    } else {
      this.props.history.push("/login");
    }
  }

  async getLanguages() {
    let result = await getAllData("show-languages");
    if(result) {
      this.setState({ languages: result.data })
    }
  }

  async deleteLanguage(lang) {
    let reqBody = {
      language_id: lang.id,
    };
    let result = await deleteRecord("delete-language", reqBody);
    if (result) {
      this.getLanguages()
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: "Language deleted successfully",
      });
    } else {
      SwalAutoHide.fire({
        icon: "error",
        timer: 2000,
        title: "Failed.",
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
            <div className="col-sm-4">
              <h3>List of Languages</h3>
            </div>
            <div className="col-sm-4">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={this.handleInputChange}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      this.handleSearch();
                    }
                  }}
                />
                <span className="input-group-btn">
                  <button
                    type="button"
                    onClick={() => this.handleSearch()}
                    className="btn btn-info search-btn"
                  >
                    Search
                  </button>
                </span>
              </div>
            </div>

            <div className="col-sm-4 pull-right mobile-space">
              <Link to={"/addLanguage"}>
                <button
                  className="btn btn-success"
                >
                  Add New Language
                </button>
              </Link>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Name </th>
                </tr>
              </thead>

              <tbody>
                {this.state.languages &&
                  this.state.languages.map((language, index) => {
                    return (
                      <tr key={language.id}>
                        <td>{index + 1}</td>

                        <td>{language.name}</td>
                        <td></td>
                        <td>
                          <button
                            onClick={() => this.deleteLanguage(language)}
                            className={`btn btn-sm btn-danger`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
