import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Cookie from 'js-cookie'
import swal from 'sweetalert'
import SwalAutoHide from 'sweetalert2'
import {
    addUpdateData,
    deleteRecord,
    getAllData,
    getDataById,
    searchData,
    updateRecord,
} from '../backend/utility'
import Swal from 'sweetalert2'
import {Button, Input, Select, Spin} from 'antd'
import {useRef} from 'react'
// import { Tabs } from 'antd'
const Services = () => {
    const [services, setServices] = useState([])
    const [occupations, setOccupations] = useState([])
    const [occupationFilters, setOccupationFilters] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getAllServices()
        getAllOccupations()
    }, [])

    // const searchInput = useRef('')

    const getAllOccupations = async () => {
        const result = await getAllData('occupations')
        if (result && result.success === true) {
            setOccupations(result.data)
        }
    }

    const getAllServices = async () => {
        setIsLoading((prev) => !prev)
        let result = await getAllData('services')
        setIsLoading((prev) => !prev)
        if (result && result.success === true && result.data) {
            setServices(result.data)
        }
    }

    const filterServices = async () => {
        let body = {
            search: {
                field: 'occupation',
                value: occupationFilters,
            },
        }
        setIsLoading((prev) => !prev)
        let result = await searchData('services/search', body)
        setIsLoading((prev) => !prev)
        if (result && result.success === true) {
            setServices(result.data)
        }
    }

    const searchServices = async () => {
        let body = {
            search: {
                field: 'you_offering',
                value: [searchInput],
            },
        }
        let result
        if (!searchInput) {
            getAllServices()
        } else {
            setIsLoading((prev) => !prev)
            result = await searchData('services/search', body)
            setIsLoading((prev) => !prev)
            if (result && result.success === true) {
                setServices(result.data)
            }
        }
    }

    const handleServiceDelete = async (serviceId) => {
        setIsLoading((prev) => !prev)
        let result = await deleteRecord(`services/${serviceId}`)
        setIsLoading((prev) => !prev)
        if (result && result.data.success === true) {
            Swal.fire({
                title: 'Service Deleted Successfully!',
                icon: 'success',
                timer: 2000,
            })
            getAllServices()
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                timer: 2000,
            })
        }
    }

    const toggleServiceBlock = async (service) => {
        let body = {
            blocked:
                service.blocked && service.blocked === 'block' ? 'unblock' : 'block',
        }
        let response = await updateRecord(`services/${service._id}`, body)
        if (response && response.success === true) {
            Swal.fire({
                title: `Service ${
                    response.data.blocked === 'block' ? 'Blocked' : 'Unblocked'
                    } Successfully!`,
                icon: 'success',
                timer: 2000,
            })
            getAllServices()
        }
    }

    return (
        <div className="row animated fadeIn">
            <div className="col-12 p-0">
                <div className="row space-1">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <h3>List of Services</h3>
                            <div
                                className="d-flex align-items-center"
                                style={{gap: '.5rem'}}
                            >
                                <Select
                                    showSearch
                                    mode="multiple"
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={true}
                                    placeholder="Filter by occupation"
                                    style={{
                                        width: '300px',
                                    }}
                                    value={occupationFilters}
                                    onChange={(occ, option) => {
                                        setOccupationFilters(occ)
                                    }}
                                >
                                    {occupations &&
                                    occupations.map((item, index) => (
                                        <Select.Option key={item.id} value={item.name}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <Button
                                    className="btn btn-primary pointer"
                                    onClick={filterServices}
                                >
                                    Filter
                                </Button>
                                <Button
                                    className="btn btn-primary pointer"
                                    onClick={() => {
                                        setOccupationFilters([])
                                        getAllServices()
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                        <div className="text-end">
                            <Input
                                allowClear
                                className="my-3"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onPressEnter={() => searchServices()}
                                placeholder="Enter title and press enter to search"
                            />
                        </div>
                    </div>
                </div>
                {!services && services.length === 0 && <h3>No Services found.</h3>}
                {isLoading && (
                    <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                        <Spin/>
                    </div>
                )}
                {services && services.length > 0 && (
                    <div className="table-responsive" style={{height: '500px'}}>
                        <table className="table table-striped">
                            <thead style={{position: "relative"}}>
                            <tr style={{position: "sticky", top: 0, background: "white", zIndex: 10}}>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Reviews Count</th>
                                <th>Average Rating</th>
                                <th>Base Price</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>

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
                                        <td>{service.you_offering}</td>
                                        <td>
                                            {service.service_description.slice(0, 25) + '...'}
                                        </td>
                                        <td>{service.reviews_count}</td>
                                        <td>{service.average_rating}</td>
                                        <td>{service.base_price}</td>

                                        <td>
                                            <button
                                                className={`btn btn-sm btn-danger`}
                                                onClick={() => toggleServiceBlock(service)}
                                            >
                                                {service.blocked && service.blocked === 'block'
                                                    ? 'Unblock'
                                                    : 'Block'}
                                            </button>
                                        </td>
                                        <td>
                                            <Link to={`/servicedetails/${service._id}`}>
                                                <button className={`btn btn-sm btn-success`}>
                                                    View
                                                </button>
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/update-service/${service._id}`}>
                                                <button className={`btn btn-sm btn-success`}>
                                                    Update
                                                </button>
                                            </Link>
                                        </td>
                                        <td>
                          <span
                              className="fa fa-trash"
                              aria-hidden="true"
                              style={{cursor: 'pointer'}}
                              onClick={() => handleServiceDelete(service._id)}
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
