import { Input, InputNumber, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { getAllData, updateRecord, uploadSingleFile } from '../backend/utility'

const { Option } = Select

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

  const handleServiceImageUpload = async (e) => {
    e.persist()
    if (!e.target.files[0]) return
    let result = await uploadSingleFile(e.target.files[0])
    if (result && result.data.success === true) {
      setServiceDetails((prev) => ({
        ...prev,
        photo: result.data.url,
      }))
    }
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
            <label>Upload Profile Image:</label>
            <input
              type="file"
              accept="image/*"
              style={{ width: '90px' }}
              onChange={handleServiceImageUpload}
            />
            <img
              src={serviceDetails.photo}
              className="d-block mt-3"
              alt=""
              width={'400px'}
              height={'400px'}
            />
          </div>
          <div className="mt-3 row">
            <div className="col-12 col-md-6">
              <label className="">Service Type: </label>
              {/* <Input
                type="text"
                className="w-100"
                name="instant_or_schedule_service"
                onChange={handleChange}
                value={serviceDetails.instant_or_schedule_service}
              /> */}
              <Select
                showSearch
                defaultActiveFirstOption={false}
                // style={{ width: 300, marginTop: 30, marginLeft: 20 }}
                showArrow={false}
                filterOption={true}
                className="w-100"
                value={serviceDetails.instant_or_schedule_service}
                onChange={(value) => {
                  setServiceDetails((prev) => ({
                    ...prev,
                    instant_or_schedule_service: value,
                  }))
                }}
              >
                <Option value={'Instant Service'}>Instant Service</Option>
                <Option value={'Scheduled Service'}>Scheduled Service</Option>
              </Select>
            </div>
            <div className="col-12 col-md-6">
              <label className="">Service Title: </label>
              <Input
                type="text"
                className="w-100"
                name="you_offering"
                onChange={handleChange}
                value={serviceDetails.you_offering}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="">Service Description: </label>
              <Input
                type="text"
                className="w-100"
                name="service_description"
                onChange={handleChange}
                value={serviceDetails.service_description}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="">Average Rating: </label>
              <InputNumber
                type="number"
                className="w-100"
                min={0}
                onChange={handleChange}
                name="average_rating"
                value={serviceDetails.average_rating}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="">Base Price: </label>
              <InputNumber
                type="number"
                min={0}
                className="w-100"
                name="base_price"
                onChange={handleChange}
                value={serviceDetails.base_price}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="">Reviews Count: </label>
              <Input
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
