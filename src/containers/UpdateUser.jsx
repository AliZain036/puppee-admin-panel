import {Select, Input, InputNumber, Spin} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2'
import {addUpdateData, getAllData, getUserImages, postDeleteUserImage, uploadSingleFile} from '../backend/utility'

const {Option} = Select
import 'react-phone-input-2/lib/material.css'
import {Country, State, City} from 'country-state-city'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import Grid from "@mui/material/Grid/Grid";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from "@material-ui/core/Button/Button";
import ResponsiveConfirmationDialog from "../components/Dialog/ResponsiveConfirmation";


let deleteData;
const initialConfirmation = {
    show: false,
    title: "",
    text: "",
    data: null,
    isUpdate: false,
    buttonYes: null,
    buttonNo: null
}

const UpdateUser = (props) => {
    const urlPathName = window.location.pathname.split('/')
    const userId = urlPathName[urlPathName.length - 1]
    const [userDetails, setUserDetails] = useState({
        birth_day: '',
        city: '',
        country: '',
        country_code: '',
        country_phone_code: '',
        profile_image_url: '',
        patch_video_url: '',
        past_work_images: [],
        first_name: '',
        gender: '',
        interests: [],
        i_am_a: [],
        is_phone_number_verified: true,
        service_provider_image: '',
        last_name: '',
        main_language: '',
        occupation: '',
        phone_number: '',
        seller_stripe_account_id: '',
        state: '',
        expertise: '',
        cover_image: '',
        user_name: '',
        user_type: '',
        business_title: '',
        is_online: false,
        seller_affiliate_link: [],
        userId: '',
        rating: 2,
        location: {
            type: '',
            coordinates: [],
        },
        email: '',
        password: '',
        blocked: false,
        short_id: '',
    })
    const [occupations, setOccupations] = useState([])
    const [languages, setLanguages] = useState([])
    const [location, setLocation] = useState({
        conutries: [],
        states: [],
        cities: [],
    })

    const [userAssets, setUserAssets] = useState(null);
    const [confirmation, setConfirmation] = useState(initialConfirmation);

    useEffect(() => {
        setUserAssets([])

        getUserDetails()
        getAllOccupations()
        getAllLanguages()
        getAllCountries()
        updateUsersList();
        getUserAssets();
    }, [userId])

    const [countries, setSountries] = useState([])

    const getAllCountries = async () => {
        let result = await getAllData('static-data/countries')
        if (result.success === true) {
            setLocation(prev => ({...prev, conutries: result.data}))
        }
    }

    useEffect(() => {
        if (userDetails.rating === null) {
            let value = userDetails.rating
            if (value) {
                value.slice(0, userDetails.length - 1)
            }
            setUserDetails((prev) => ({...prev, rating: value}))
        }
    }, [userDetails.rating])

    const [isLoading, setIsLoading] = useState(false)

    const getAllOccupations = async () => {
        const result = await getAllData('occupations')
        if (result && result.success === true) {
            setOccupations(result.data)
        }
    }

    const getAllLanguages = async () => {
        const result = await getAllData('languages')
        if (result && result.success === true) {
            setLanguages(result.data)
        }
    }

    const getUserDetails = async () => {
        setIsLoading(true)
        let result = await getAllData(`users/${userId}`)
        if (result && result.success === true && result.statusCode === 200) {
            setUserDetails(result.data)
        }
        setIsLoading(false)
    }

    const handleChange = (e) => {
        let value = e.target.value
        if (typeof e.target.value === 'string') {
            value.trim()
        }
        setUserDetails((prev) => ({...prev, [e.target.name]: value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let body = {
            ...userDetails,
            userId: userDetails._id,
            seller_stripe_account_id: userDetails.seller_stripe_account_id || 'false',
        }
        body.rating = Number(userDetails.rating)
        body.country = userDetails.country
        body.state = userDetails.state
        body.city = userDetails.city
        body.short_id = userDetails.user_name
        setIsLoading(true)
        let result = await addUpdateData('users/profile', body)
        if (result && result.success === true && result.data) {
            Swal.fire({
                title: 'User Details Updated Successfully',
                icon: 'success',
                timer: 2000,
            })
            //history.pushState('', '', '/users')
        }
        setIsLoading(false)
    }

    const handleProfileImageChange = async (e) => {
        e.persist()
        if (!e.target.files[0]) return
        setIsLoading(true)
        let result = await uploadSingleFile(e.target.files[0])
        setIsLoading(false)
        if (result && result.data.success === true) {
            setUserDetails((prev) => ({
                ...prev,
                profile_image_url: result.data.url,
            }))
        }
    }

    useEffect(() => {

    }, [location])


    const handleRatingInput = (e) => {
        if (typeof e.key === 'number') {
            setUserDetails((prev) => ({...prev, rating: e.key}))
        }
    }

    const updateCountryStates = async (selectedCountry) => {
        let result = await getAllData(`static-data/country/${selectedCountry.isoCode}`)
        if (result.success === true) {
            setLocation(prev => ({...prev, states: result.data}))
        }
    }

    const updateCountryStateCities = async (selectedState, countryIsoCode) => {
        let result = await getAllData(`static-data/country/${countryIsoCode}/${selectedState.isoCode}`)
        if (result.success === true) {
            setLocation(prev => ({...prev, cities: result.data}))
        }
    }

    const getUserAssets = async () => {
        let result = await getUserImages(`users/${userId}/images`);
        setUserAssets(result);
    }


    const getFilteredUsersList = (usersList) => {
        const userType = localStorage.getItem("user_type") || 0
        if (userType == 1) {
            return usersList.filter((user) => user.user_type === "browser")
        } else if (userType == 2) {
            return usersList.filter((user) => user.user_type === "seller")
        } else if (userType == 3) {
            return usersList.filter((user) => user.user_type === "service_provider")
        }
        return usersList
    }


    const updateUsersList = (inc, dec) => {
        const stringifyUsersList = localStorage.getItem("users_list");
        const jsonUsers = stringifyUsersList && JSON.parse(stringifyUsersList);
        const usersList = getFilteredUsersList(jsonUsers.users);
        if (usersList && usersList.length > 0) {
            const index = usersList.findIndex((user) => (user.id).toString() === userId);
            localStorage.setItem("users_list", JSON.stringify(
                {users: usersList, current: index})
            );
        }

    }


    const incDecCounter = (inc) => {
        const stringifyUsersList = localStorage.getItem("users_list");
        const jsonUsers = stringifyUsersList && JSON.parse(stringifyUsersList);
        const usersList = getFilteredUsersList(jsonUsers.users);

        let index = jsonUsers.current || 0;

        if (usersList && usersList.length > 0) {
            if (inc) {
                if (index === usersList.length - 1) {
                    index = 0;
                } else {
                    index += 1;
                }
            } else {
                if (index === 0) {
                    index = usersList.length - 1;
                } else {
                    index -= 1;
                }
            }
        }

        localStorage.setItem("users_list", JSON.stringify(
            {users: usersList, current: index})
        );
        return usersList[index].id;
    }


    const onClickPrev = (e) => {
        const userId = incDecCounter(false);
        props.history.push(`/updateUser/${userId}`)
    }

    const onClickNext = (e) => {
        const userId = incDecCounter(true);
        props.history.push(`/updateUser/${userId}`)
    }


    const deleteUserImage=async ()=>{
        console.log("deleteUserImage = ",deleteData)
        if(deleteData){
            await postDeleteUserImage("users/images/delete",{list:[deleteData]});
            getUserAssets();
            deleteData=null;
        }
    }


    const handleDeleteUserImage=(data)=>{
        console.log("data = ",data)
        deleteData=data;
        setConfirmation({
            show: true,
            title: "Delete User Asset",
            text: "Are you sure you want to delete this image",
            data: data,
            isUpdate: false,
            buttonYes:
                <Button onClick={(e) => {
                    console.log("data = ",confirmation);
                    deleteUserImage();
                    setConfirmation(initialConfirmation)
                }}>{"OK"}</Button>,
            buttonNo:
                <Button onClick={(e) => {
                    setConfirmation(initialConfirmation)
                }}>{"Cancel"}</Button>
        })
    }


    console.log("user = ", confirmation);



    const UserImagesContainer = () => {
        let Images = [];
        const userImages = userAssets && userAssets.user || [];
        const serviceImages = userAssets && userAssets.services || [];
        const posts = userAssets && userAssets.posts || [];

        if (userImages.cover_image && (userImages.cover_image).length > 0) {
            Images.push(
                <Grid container item xs={2.8} style={{marginTop:"10px",position:"relative"}}>
                    <Grid item>
                        <img style={{width: "100%", maxHeight: "220px"}} src={userImages.cover_image}/>
                    </Grid>
                    <Grid item style={{position:"absolute",top:"10px",right:"3px",zIndex:1,cursor:"pointer"}}
                          onClick={(e)=>handleDeleteUserImage({id:userId,cover_image:true,type:"user"})}>
                        <CancelIcon style={{color:"white"}}/>
                    </Grid>
                </Grid>
            )
        }

        if (userImages.profile_image_url && (userImages.cover_image).length > 0) {
            Images.push(
                <Grid container item xs={2.8} style={{marginTop:"10px",position:"relative",}}>
                    <Grid item>
                        <img style={{width: "100%", maxHeight: "220px"}} src={userImages.profile_image_url}/>
                    </Grid>
                    <Grid item style={{position:"absolute",top:"10px",right:"3px",zIndex:1,cursor:"pointer"}}
                          onClick={(e)=>handleDeleteUserImage({id:userId,profile_image_url:true,type:"user"})}>
                        <CancelIcon style={{color:"white"}}/>
                    </Grid>
                </Grid>
            )
        }

        for(let post of posts){
            const postImages=post.post_images;
            if(postImages){
                for(let postImage of postImages){
                    if(postImage && postImage.image_url){
                       Images.push(
                           <Grid container item xs={2.8} style={{marginTop:"10px",position:"relative"}}>
                               <Grid item>
                                   <img style={{width: "100%", maxHeight: "220px"}} src={postImage.image_url}/>
                               </Grid>
                               <Grid item style={{position:"absolute",top:"10px",right:"3px",zIndex:1,cursor:"pointer"}}
                                     onClick={(e)=>handleDeleteUserImage({id:post._id,type:"post",assetId:postImage._id})}>
                                   <CancelIcon style={{color:"white"}}/>
                               </Grid>
                           </Grid>
                       )
                    }
                }
            }
        }

        const ServiceImageContainer = serviceImages.filter((service) => service && service.photo).map((service) =>
            <Grid container item xs={2.8} style={{marginTop:"10px",position:"relative"}}>
                <Grid item style={{position:"absolute",top:"10px",right:"3px",zIndex:1,cursor:"pointer"}}
                      onClick={(e)=>handleDeleteUserImage({id:service._id,profile_image_url:true,type:"service"})}>
                    <CancelIcon style={{color:"white"}}/>
                </Grid>
                <img style={{width: "100%", maxHeight: "220px"}} src={service.photo}/>
            </Grid>
        )


        Images = Images.concat(ServiceImageContainer);
        return Images;

    }


    return (
        <div className="row animated fadeIn">
            {
                confirmation.show &&
                <ResponsiveConfirmationDialog
                    title={confirmation.title} text={confirmation.text}
                    buttons={confirmation.buttonYes}
                    otherButton={confirmation.buttonNo}
                />
            }
            <Grid container justifyContent={"space-between"} sx={{padding: "20px"}}>
                <Grid item style={{cursor: "pointer"}} onClick={onClickPrev}>
                    <ArrowBackIcon/>
                </Grid>
                <Grid item style={{cursor: "pointer"}} onClick={onClickNext}>
                    <ArrowForwardIcon/>
                </Grid>
            </Grid>

            <Grid container justifyContent={"space-between"}>

                <Grid item xs={5.5}>
                    <div className="col-12 p-0">
                        <h3>Update User Details</h3>
                        {userDetails && (
                            <form onSubmit={handleSubmit}>
                                <div className="row px-3 mt-3">
                                    <div className="col-12 col-md-6">
                                        <label className="m-0">Upload Profile Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfileImageChange}
                                            style={{width: '90px'}}
                                        />
                                    </div>
                                    <div className="col-12 mt-2">
                                        {isLoading && (
                                            <div className="w-100 d-flex align-items-center">
                                                <Spin/>
                                            </div>
                                        )}
                                        <img
                                            src={userDetails.profile_image_url}
                                            alt=""
                                            style={{
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                width: '200px',
                                                height: '200px',
                                            }}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">First Name: </label>
                                        <Input
                                            type="text"
                                            value={userDetails.first_name}
                                            className="w-100"
                                            name="first_name"
                                            pattern="^[a-zA-Z]*$"
                                            title="First name should only contain alphabetic charaters. e.g. john"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">Last Name: </label>
                                        <Input
                                            type="text"
                                            value={userDetails.last_name}
                                            className="w-100"
                                            pattern="^[a-zA-Z]*$"
                                            name="last_name"
                                            title="Last name should only contain alphabetic charaters. e.g. doe"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">Username: </label>
                                        <Input
                                            type="text"
                                            value={userDetails.user_name}
                                            className="w-100"
                                            name="user_name"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">Email: </label>
                                        <Input
                                            type="email"
                                            value={userDetails.email}
                                            className="w-100"
                                            name="email"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">Country: </label>
                                        <Select
                                            showSearch
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={true}
                                            value={userDetails.country}
                                            className="w-100"
                                            onChange={(country) => {
                                                const selectedCountry = location.conutries.find(
                                                    (el) => el.name === country,
                                                )
                                                updateCountryStates(selectedCountry)
                                                // setLocation((prev) => ({
                                                //   ...prev,
                                                //   states: State.getStatesOfCountry(selectedCountry.isoCode),
                                                // }))
                                                setUserDetails((prev) => ({
                                                    ...prev,
                                                    country: selectedCountry.name,
                                                    country_code: selectedCountry.isoCode,
                                                    country_phone_code: selectedCountry.phonecode,
                                                    state: '',
                                                    city: '',
                                                }))
                                            }}
                                        >
                                            {location &&
                                            location.conutries &&
                                            location.conutries.map((item, index) => (
                                                <Option key={index} value={item.name}>
                                                    {item.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">State: </label>
                                        <Select
                                            showSearch
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={true}
                                            value={userDetails.state}
                                            className="w-100"
                                            onChange={(state) => {
                                                const selectedCountry = location.conutries.find(country => country.name === userDetails.country)
                                                const selectedState = location.states.find(
                                                    (el) => el.name === state,
                                                )
                                                updateCountryStateCities(selectedState, selectedCountry.isoCode)
                                                // setLocation((prev) => ({
                                                //   ...prev,
                                                //   cities: City.getCitiesOfState(
                                                //     selectedState.countryCode,
                                                //     selectedState.isoCode,
                                                //   ),
                                                // }))
                                                setUserDetails((prev) => ({
                                                    ...prev,
                                                    state: selectedState.name,
                                                    city: '',
                                                }))
                                            }}
                                        >
                                            {location &&
                                            location.states &&
                                            location.states.map((item, index) => (
                                                <Option key={index} value={item.name}>
                                                    {item.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">City: </label>
                                        <Select
                                            showSearch
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={true}
                                            className="w-100"
                                            value={userDetails.city}
                                            onChange={(city) => {
                                                setUserDetails((prev) => ({
                                                    ...prev,
                                                    city: city,
                                                }))
                                            }}
                                        >
                                            {location &&
                                            location.cities &&
                                            location.cities.map((item, index) => (
                                                <Option key={index} value={item.name}>
                                                    {item.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">Phone Number: </label>
                                        {/* <ReactPhoneInput
                  inputExtraProps={{
                    name: 'phone_number',
                    required: true,
                    // autoFocus: true,
                  }}
                  value={userDetails.phone_number}
                  onChange={(value, country, e, formattedValue) => {
                    setUserDetails((prev) => ({
                      ...prev,
                      phone_number: userDetails.phone_number.startsWith(
                        '+' + country.dialCode,
                      )
                        ? formattedValue
                        : '',
                    }))
                    // if (
                    //   !userDetails.phone_number.startsWith(country.dialCode)
                    // ) {
                    // }
                    // setUserDetails((prev) => ({ ...prev, phone_number }))
                  }}
                /> */}
                                        <PhoneInput
                                            international
                                            countryCallingCodeEditable={false}
                                            defaultCountry="US"
                                            value={userDetails.phone_number}
                                            onChange={(phone_number) => {
                                                setUserDetails((prev) => ({
                                                    ...prev,
                                                    phone_number: phone_number,
                                                }))
                                            }}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">Gender: </label>
                                        <Select
                                            showSearch
                                            defaultActiveFirstOption={false}
                                            // style={{ width: 300, marginTop: 30, marginLeft: 20 }}
                                            showArrow={false}
                                            filterOption={true}
                                            className="w-100"
                                            value={userDetails.gender}
                                            onChange={(gender) => {
                                                setUserDetails((prev) => ({...prev, gender}))
                                            }}
                                        >
                                            <Option value={'male'}>Male</Option>
                                            <Option value={'female'}>Female</Option>
                                            <Option value={'other'}>Other</Option>
                                        </Select>
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">Rating: </label>
                                        {/* <input
                  type="number"
                  name="test_name"
                  min="0"
                  oninput="validity.valid||(value='');"
                /> */}

                                        {/* <Input
                  type="text"
                  onChange={(e) => {
                    if (Number(e.target.value)) {
                    } else {
                      e.target.value = null
                    }
                  }}
                /> */}
                                        <Input
                                            type="number"
                                            value={userDetails.rating}
                                            className="w-100"
                                            name="rating"
                                            // onInput={(e) => {
                                            //   if (isNumber(e)) {
                                            //   }
                                            // }}
                                            // onKeyPress={(e) => {
                                            //   e.target.value = Math.max(0, parseInt(e.target.value))
                                            //     .toString()
                                            //     .slice(0, 1)
                                            // }}
                                            pattern="^[0-9\b]+$"
                                            title="Rating should only contain positive numbers"
                                            min={0}
                                            max={5}
                                            onChange={(e) => {
                                                setUserDetails((prev) => ({
                                                    ...prev,
                                                    rating: e.target.value,
                                                }))
                                            }}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">Occupation: </label>
                                        <Select
                                            showSearch
                                            defaultActiveFirstOption={false}
                                            // style={{ width: 300, marginTop: 30, marginLeft: 20 }}
                                            showArrow={false}
                                            filterOption={true}
                                            className="w-100"
                                            value={userDetails.occupation}
                                            onChange={(occ, option) => {
                                                setUserDetails((prev) => ({...prev, occupation: occ}))
                                            }}
                                        >
                                            {occupations &&
                                            occupations.map((item, index) => (
                                                <Option key={item.id} value={item.name}>
                                                    {item.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-12 col-md-6 mt-2">
                                        <label className="m-0">Main Language: </label>
                                        <Select
                                            showSearch
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={true}
                                            value={userDetails.main_language}
                                            className="w-100"
                                            onChange={(language) => {
                                                setUserDetails((prev) => ({
                                                    ...prev,
                                                    main_language: language,
                                                }))
                                            }}
                                        >
                                            {languages &&
                                            languages.map((item, index) => (
                                                <Option key={item._id} value={item.name}>
                                                    {item.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-12 d-flex justify-content-between align-items-center flex-wrap">
                                        <Link to={'/users'}>
                                            <button
                                                className={`btn btn-sm btn-primary mt-3`}
                                                type="button"
                                            >
                                                Back
                                            </button>
                                        </Link>
                                        <button className={`btn btn-sm btn-success mt-3`} type="submit">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </Grid>
                <Grid item xs={5.5} container justifyContent={"space-between"} style={{height:"80vh",overflow:"auto"}}>
                    {UserImagesContainer()}
                </Grid>
            </Grid>
        </div>
    )
}

export default UpdateUser
