import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cookie from 'js-cookie'
import swal from 'sweetalert'
import SwalAutoHide from 'sweetalert2'
import {
  addUpdateData,
  deleteRecord,
  getAllData,
  updateRecord,
} from '../backend/utility'
import Swal from 'sweetalert2'
// import { Tabs } from 'antd'
const Orders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    getAllOrders()
  }, [])

  const getAllOrders = async () => {
    let result = await getAllData('service-orders')
    if (result && result.success === true && result.data) {
      setOrders(result.data)
    }
  }

  const handleOrderDelete = async (orderId) => {
    let result = await deleteRecord(`service-orders/${orderId}`)
    if (result && result.data.success === true) {
      Swal.fire({
        title: 'Order Deleted Successfully!',
        icon: 'success',
        timer: 2000,
      })
      getAllOrders()
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong, please try again.',
        icon: 'error',
        timer: 2000,
      })
    }
  }

  const toggleOrderBlock = async (order) => {
    let body = {
      service_order_id: order._id,
      blocked: order.blocked && order.blocked === 'block' ? 'unblock' : 'block',
      status: order.status,
    }
    let response = await updateRecord(`service-orders`, body)
    if (response && response.success === true) {
      Swal.fire({
        title: `Order ${
          response.data.blocked === 'block' ? 'Blocked' : 'Unblocked'
        } Successfully!`,
        icon: 'success',
        timer: 2000,
      })
      getAllOrders()
    }
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12 p-0">
        <div className="row space-1">
          <div className="col-12">
            <h3>List of Orders</h3>
          </div>
        </div>
        {orders && orders.length > 0 && (
          <div className="table-responsive" style={{ height: '700px' }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Cover Image</th>
                  <th>Total Price</th>
                  <th>Description</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders &&
                  orders.map((order, index) => {
                    return (
                      <tr key={order._id}>
                        <td>{order.date}</td>
                        <td>{order.title}</td>
                        <td>
                          <img
                            style={{
                              height: '50px',
                              width: '50px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                            src={order.cover_image}
                          />
                        </td>
                        <td>{order.total_price}</td>
                        <td>{order.description}</td>
                        <td>{order.address}</td>
                        <td>{order.status}</td>
                        <td>
                          <button
                            className={`btn btn-sm btn-danger`}
                            onClick={() => toggleOrderBlock(order)}
                          >
                            {order.blocked && order.blocked === 'block'
                              ? 'Unblock'
                              : 'Block'}
                          </button>
                        </td>
                        <td>
                          <Link to={`/orderdetails/${order._id}`}>
                            <button className={`btn btn-sm btn-success`}>
                              View
                            </button>
                          </Link>
                        </td>
                        <td>
                          <Link to={`/update-order/${order._id}`}>
                            <button className={`btn btn-sm btn-success`}>
                              Update
                            </button>
                          </Link>
                        </td>
                        <td>
                          <span
                            className="fa fa-trash"
                            aria-hidden="true"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleOrderDelete(order._id)}
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

export default Orders
