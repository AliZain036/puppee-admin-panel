import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllData } from '../backend/utility'
import UserDetails from './UserDetails'

const ServiceDetails = () => {
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

  return (
    <div className="row animated fadeIn">
      <div className="col-12">
        <h3>Service Details</h3>
        <div>
          <img
            src={serviceDetails.photo}
            alt=""
            width={'400px'}
            height="400px"
          />
        </div>
        <div className="mt-3 row">
          <div className="col-12 col-md-6">
            <label className="">Service Type: </label>
            <Input
              type="text"
              className="w-100"
              readOnly
              value={serviceDetails.instant_or_schedule_service}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="">Service Title: </label>
            <Input
              type="text"
              className="w-100"
              readOnly
              value={serviceDetails.you_offering}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="">Service Description: </label>
            <Input
              type="text"
              className="w-100"
              readOnly
              value={serviceDetails.service_description}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="">Average Rating: </label>
            <Input
              type="text"
              className="w-100"
              readOnly
              value={serviceDetails.average_rating}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="">Base Price: </label>
            <Input
              type="text"
              className="w-100"
              readOnly
              value={serviceDetails.base_price}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="">Reviews: </label>
            <Input
              type="text"
              className="w-100"
              readOnly
              value={serviceDetails.reviews_count}
            />
          </div>
        </div>
        <Link to={'/services'}>
          <button className="btn btn-primary my3" type="button">
            Back
          </button>
        </Link>
      </div>
    </div>
  )
}

export default ServiceDetails
