import { Input } from 'antd'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllData } from '../backend/utility'

const OrderDetails = () => {
  const urlPathName = window.location.pathname.split('/')
  const id = urlPathName[urlPathName.length - 1]
  console.log(urlPathName, id)
  const [orderDetails, setOrderDetails] = useState({})

  useEffect(() => {
    getOrderDetails()
  }, [])

  const getOrderDetails = async () => {
    let result = await getAllData(`service-orders/detail/${id}`)
    if (result && result.success === true && result.statusCode === 200) {
      setOrderDetails(result.data)
    }
  }

  return (
    <div className="row animated fadeIn pb-4">
      <div className="col-12">
        <h3>Order Details</h3>
      </div>
      <div className="col-12">
        <label>Cover Image</label>
        <img
          src={orderDetails.cover_image}
          alt=""
          className="d-block"
          width={'400px'}
          height={'400px'}
        />
      </div>
      <div className="col-12 col-md-6">
        <label>Date</label>
        <Input readOnly value={orderDetails.date} />
      </div>
      <div className="col-12 col-md-6">
        <label>Title</label>
        <Input readOnly value={orderDetails.title} />
      </div>
      <div className="col-12 col-md-6">
        <label>Customer Reviewed</label>
        <Input readOnly value={orderDetails.customer_reviewed ? 'Yes' : 'No'} />
      </div>
      <div className="col-12 col-md-6">
        <label>Deadline Date</label>
        <Input
          readOnly
          value={new Date(orderDetails.deadline_date).toLocaleDateString()}
        />
      </div>
      <div className="col-12 col-md-6">
        <label>Status</label>
        <Input readOnly value={orderDetails.status} />
      </div>
      <div className="col-12 col-md-6">
        <label>Discount</label>
        <Input readOnly value={orderDetails.discount} />
      </div>
      <div className="col-12 col-md-6">
        <label>Service Charges</label>
        <Input readOnly value={orderDetails.service_charges} />
      </div>
      <div className="col-12 col-md-6">
        <label>Address</label>
        <Input readOnly value={orderDetails.address} />
      </div>
      <div className="col-12 col-md-6">
        <label>Rating</label>
        <Input readOnly value={orderDetails.rating} />
      </div>
      <div className="col-12 col-md-6">
        <label>Total Reviews</label>
        <Input readOnly value={orderDetails.total_reviews} />
      </div>
      <div className="col-12 col-md-6">
        <label>Total Price</label>
        <Input readOnly value={orderDetails.total_price} />
      </div>
      <div className="col-12 col-md-6">
        <label>Description</label>
        <Input readOnly value={orderDetails.description} />
      </div>
      <div className="col-12 col-md-6">
        <label>Service Price</label>
        <Input readOnly value={orderDetails.service_price} />
      </div>
      <div className="col-12 col-md-6">
        <label>Service Price</label>
        <Input readOnly value={orderDetails.service_price} />
      </div>
      <div className="col-12 col-md-6">
        <label>Service Type</label>
        <Input readOnly value={orderDetails.instant_or_schedule_service} />
      </div>
      <div className="col-12 mt-3">
        <Link to={'/orders'}>
          <button className="btn btn-primary">Back</button>
        </Link>
      </div>
    </div>
  )
}

export default OrderDetails
