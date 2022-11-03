import { Input } from 'antd'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { addUpdateData, getAllData, uploadSingleFile } from '../backend/utility'

const UpdateOrder = () => {
  const urlPathName = window.location.pathname.split('/')
  const id = urlPathName[urlPathName.length - 1]
  console.log(urlPathName, id)
  const [orderDetails, setOrderDetails] = useState({})
  const [isLoading, setIsLoading] = useState(second)

  useEffect(() => {
    getOrderDetails()
  }, [])

  const getOrderDetails = async () => {
    let result = await getAllData(`service-orders/detail/${id}`)
    if (result && result.success === true && result.statusCode === 200) {
      setOrderDetails(result.data)
    }
  }

  const handleOrderImagePicture = async (e) => {
    e.persist()
    if (!e.target.files[0]) return
    setIsLoading(true)
    let result = await uploadSingleFile(e.target.files[0])
    setIsLoading(false)
    if (result && result.data.success === true) {
      setOrderDetails((prev) => ({
        ...prev,
        cover_image: result.data.url,
      }))
    }
  }

  const handleChange = (e) => {
    setOrderDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let body = {
      ...orderDetails,
      service_order_id: orderDetails && orderDetails._id,
    }
    body.service_provider_id = body.service_provider_id
      ? body.service_provider_id
      : ''
    body.rating = Number(orderDetails.rating)
    let result = await addUpdateData('service-orders', body)
    if (result && result.success === true && result.data) {
      Swal.fire({
        title: 'Order Details Updated Successfully',
        icon: 'success',
        timer: 2000,
      })
    }
  }

  return (
    <div className="row animated fadeIn pb-4">
      <form onSubmit={handleSubmit} className="row">
        <div className="col-12">
          <h3>Order Details</h3>
        </div>
        <div className="col-12">
          <label>Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleOrderImagePicture}
            style={{ width: '90px' }}
          />
          {isLoading && (
            <div className="w-100 d-flex align-items-center">
              <Spin /> <p>Uploading ... </p>
            </div>
          )}
          <img
            src={orderDetails.cover_image}
            alt=""
            className="d-block"
            width={'400px'}
            height={'400px'}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Date</label>
          <Input readOnly value={orderDetails.date} />
        </div>
        <div className="col-12 col-md-6">
          <label>Title</label>
          <Input
            type={'text'}
            value={orderDetails.title}
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Customer Reviewed</label>
          <Input
            readOnly
            value={orderDetails.customer_reviewed ? 'Yes' : 'No'}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Deadline Date</label>
          <Input
            readOnly
            value={new Date(orderDetails.deadline_date).toLocaleDateString()}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Order Status</label>
          <Input readOnly value={orderDetails.status} />
        </div>
        <div className="col-12 col-md-6">
          <label>Discount</label>
          <Input
            value={orderDetails.discount}
            name="discount"
            type={'number'}
            min={0}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Service Charges</label>
          <Input
            type="number"
            min={0}
            value={orderDetails.service_charges}
            name="service_charges"
            className="d-block w-100"
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Address</label>
          <Input
            value={orderDetails.address}
            name="address"
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Rating</label>
          <Input
            value={orderDetails.rating}
            className="d-block w-100"
            min={0}
            type="number"
            onChange={handleChange}
            name="rating"
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Total Reviews</label>
          <Input readOnly value={orderDetails.total_reviews} />
        </div>
        <div className="col-12 col-md-6">
          <label>Total Price</label>
          <Input
            value={orderDetails.total_price}
            min={0}
            className="d-block w-100"
            type="number"
            onChange={handleChange}
            name="total_price"
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Description</label>
          <Input
            value={orderDetails.description}
            name="description"
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Service Price</label>
          <Input
            value={orderDetails.service_price}
            name="service_price"
            min={0}
            className="d-block w-100"
            type="number"
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Service Type</label>
          <Input readOnly value={orderDetails.instant_or_schedule_service} />
        </div>
        <div className="col-12 mt-3 d-flex justify-content-between align-items-center flex-wrap">
          <Link to={'/orders'}>
            <button className="btn btn-primary">Back</button>
          </Link>
          <button className="btn btn-success" type="submit">
            Update
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateOrder
