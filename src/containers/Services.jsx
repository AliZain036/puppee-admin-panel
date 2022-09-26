import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cookie from 'js-cookie'
import swal from 'sweetalert'
import SwalAutoHide from 'sweetalert2'
import { deleteRecord, getAllData } from '../backend/utility'
import Swal from 'sweetalert2'
// import { Tabs } from 'antd'
const Services = () => {
  const [services, setServices] = useState([])

  useEffect(() => {
    getAllServices()
  }, [])

  const getAllServices = async () => {
    let result = await getAllData('services')
    if (result && result.success === true && result.data) {
      setServices(result.data)
    }
  }

  const handlePostDelete = async (postId) => {
    let body = {
      postId,
    }
    let result = await deleteRecord('services', body)
    if (
      result.data.success === true &&
      result.data.message === 'services Deleted'
    ) {
      Swal.fire({
        title: 'Post Deleted Successfully!',
        icon: 'success',
        timer: '2000',
      })
      getAllServices()
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong, please try again.',
        icon: 'error',
        timer: '2000',
      })
    }
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12 p-0">
        <div className="row space-1">
          <div className="col-12">
            <h3>List of Services</h3>
          </div>
        </div>
        {services && services.length > 0 && (
          <div className="table-responsive" style={{ height: '700px' }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Reviews Count</th>
                  <th>Average Rating</th>
                  <th>Base Price</th>
                  {/* <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th> */}
                </tr>
              </thead>

              <tbody>
                {services &&
                  services.map((service, index) => {
                    return (
                      <tr key={service._id}>
                        {/* <td>{index + 1}</td> */}
                        {/* <td>{new Date(service.timestamp).toLocaleDateString()}</td> */}
                        <td>
                          <img
                            style={{
                              height: '50px',
                              width: '50px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                            src={service.photo}
                          />
                        </td>
                        <td>
                          {service.service_description.slice(0, 25) + '...'}
                        </td>
                        <td>{service.reviews_count}</td>
                        <td>{service.average_rating}</td>
                        <td>{service.base_price}</td>

                        {/* <td>
                          <button
                            className={`btn btn-sm btn-danger`}
                          >
                            {service.status && service.status === 'active'
                              ? 'Block'
                              : 'Unblock'}
                          </button>
                        </td> */}
                        {/* <td>
                          <Link to={`/servicedetails/${service.id}`}>
                            <button className={`btn btn-sm btn-success`}>
                              View
                            </button>
                          </Link>
                        </td> */}
                        {/* <td>
                          <Link to={`/updateservice/${service.id}`}>
                            <button className={`btn btn-sm btn-success`}>
                              Update
                            </button>
                          </Link>
                        </td> */}
                        <td>
                          <span
                            className="fa fa-trash"
                            aria-hidden="true"
                            style={{ cursor: 'pointer' }}
                          ></span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Services
