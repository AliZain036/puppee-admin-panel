import React from 'react'
import Cookie from 'js-cookie'
import SwalAutoHide from 'sweetalert2'
import { deleteRecord, getAllData, searchData } from '../backend/utility'
import { Link } from 'react-router-dom'

export default class AssociatedCompanies extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      categories: [],
      searchQuery: '',
    }
  }

  componentDidMount() {
    if (Cookie.get('token')) {
      this.getAssociatedCompanies()
    } else {
      this.props.history.push('/login')
    }
  }

  async getAssociatedCompanies() {
    let result = await getAllData('show-associate-companies')
    this.setState({ categories: result.data })
  }

  async deleteAssociatedCompany(id) {
    let reqBody = {
      associateCompany_id: id,
    }
    let result = await deleteRecord('delete-associate-company', reqBody)
    if (result.success === true) {
      SwalAutoHide.fire({
        icon: 'success',
        timer: 2000,
        title: 'Success.',
        showConfirmButton: false,
        text: 'Associated Company Deleted Successfully!',
      })
      this.getAssociatedCompanies()
    } else {
      SwalAutoHide.fire({
        icon: 'error',
        timer: 2000,
        title: 'Failed.',
        showConfirmButton: false,
        text: 'Something went wrong!',
      })
    }
  }

  async handleSearch() {
    let { searchQuery } = this.state
    searchQuery = searchQuery.trim()
    let searchResults
    if (searchQuery.length > 0) {
      let reqBody = {
        query: searchQuery,
      }
      searchResults = await searchData('search-associate-companies', reqBody)
      if (searchResults.data && searchResults.data.length > 0) {
        this.setState({ categories: searchResults.data, searchQuery: '' })
      } else {
        this.setState({ categories: [], searchQuery: '' })
      }
    } else {
      this.getAssociatedCompanies()
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Associated Companies</h3>
            </div>
            <div className="col-sm-4">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.searchQuery}
                  onChange={(event) =>
                    this.setState({ searchQuery: event.target.value })
                  }
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.handleSearch()
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

            {/* <div className="col-sm-4 pull-right mobile-space">
              <button
                type="button"
                className="btn btn-success"
              >
                Add new Category
              </button>
            </div> */}
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Name </th>
                  <th>Associated To </th>
                </tr>
              </thead>

              <tbody>
                {this.state.categories &&
                  this.state.categories.map((cat, index) => {
                    return (
                      <tr key={cat.id}>
                        <td>{index + 1}</td>
                        <td>{cat.name}</td>
                        <td>{cat.category && cat.category.name}</td>
                        <td>
                          <Link to={`/updateAssociatedCompany/${cat.id}`}>
                            <button
                              className={`btn btn-sm btn-success`}
                            >
                              Update
                            </button>
                          </Link>
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm btn-danger`}
                            onClick={() => this.deleteAssociatedCompany(cat.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
