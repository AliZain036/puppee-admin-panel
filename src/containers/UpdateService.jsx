import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { getAllData, updateRecord } from '../backend/utility'

const UpdateService = () => {
  const urlPathName = window.location.pathname.split('/')
  const serviceId = urlPathName[urlPathName.length - 1]
  useEffect(() => {
    getServiceDetails()
  }, [])

  const [serviceDetails, setServiceDetails] = useState({
    blocked: '',
    location: '',
    reviews_count: '',
    average_rating: '',
    _id: '',
    add_on: [],
    base_price: null,
    traver_for_service: null,
    instant_or_schedule_service: '',
    service_description: '',
    you_offering: '',
    photo: '',
    user_id: '',
    packages: [],
  })

  const getServiceDetails = async () => {
    let result = await getAllData(`services/${serviceId}`)
    if (result && result.success === true) {
      setServiceDetails((prev) => ({ ...prev, ...result.data }))
    }
  }

  const handleChange = (e) => {
    e.persist()
    setServiceDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleServiceUpdate = async (e) => {
    e.preventDefault()
    let body = {
      ...serviceDetails,
    }
    body.base_price = Number(serviceDetails.base_price)
    body.average_rating = Number(serviceDetails.average_rating)
    body.reviews_count = Number(serviceDetails.reviews_count)
    let response = await updateRecord(`services/${serviceDetails._id}`, body)
    if (response && response.success === true) {
      Swal.fire({
        title: 'Service Updated Successfully',
        icon: 'success',
        timer: 2000,
      })
    }
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12">
        <h3>Service Details</h3>
        <form onSubmit={handleServiceUpdate}>
          <div>
            <label className="d-block">Service Image: </label>
            <img src={serviceDetails.photo} alt="" />
          </div>
          <div className="mt-3 row">
            <div className="col-12 col-md-6">
              <label className="">Service Type: </label>
              <input
                type="text"
                className="w-100"
                name="instant_or_schedule_service"
                onChange={handleChange}
                value={serviceDetails.instant_or_schedule_service}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="">Service Title: </label>
              <input
                type="text"
                className="w-100"
                name="you_offering"
                onChange={handleChange}
                value={serviceDetails.you_offering}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="">Service Description: </label>
              <input
                type="text"
                className="w-100"
                name="service_description"
                onChange={handleChange}
                value={serviceDetails.service_description}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="">Average Rating: </label>
              <input
                type="number"
                className="w-100"
                onChange={handleChange}
                name="average_rating"
                value={serviceDetails.average_rating}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="">Base Price: </label>
              <input
                type="number"
                className="w-100"
                name="base_price"
                onChange={handleChange}
                value={serviceDetails.base_price}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="">Reviews: </label>
              <input
                type="number"
                className="w-100"
                name="reviews_count"
                onChange={handleChange}
                value={serviceDetails.reviews_count}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-3">
            Update Service
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateService
