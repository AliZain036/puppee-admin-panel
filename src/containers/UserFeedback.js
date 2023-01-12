import React, {Fragment, useEffect, useState} from 'react'
import {getAllData, getUserFeedback, updateUserFeedback} from "../backend/utility";
import Grid from "@material-ui/core/Grid/Grid";
import Person2Icon from '@mui/icons-material/Person2';
import Paper from "@material-ui/core/Paper/Paper";
import Divider from "@material-ui/core/Divider/Divider";
import {Input} from "antd";
import moment from "moment";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const FeedbackItemContainer = (props) => {
    const {feed,index,getFeedback} = props;
    const {first_name, last_name, email, profile_image_url} = feed;
    const [replyText, setReplyText] = useState("");

    const onChangeReply = (e) => {
        setReplyText(e.target.value);
    }

    const updateFeedback=async(e)=>{
        if(replyText.length>0){
            feed.reply=replyText
            await updateUserFeedback(`users/${feed._id}/feedback`,feed);
            getFeedback();
        }
    }


    return (
        <Fragment>
            <Grid item xs={5} style={{marginTop:"5px"}}>
                <Paper paper style={{width: "100%", padding: "10px", background: "white"}}>
                    <Grid item xs={12} container justifyContent={"space-between"}>
                        <Grid item>
                            <Person2Icon/>
                        </Grid>
                        <Grid item style={{marginLeft: "10px"}}>
                            <Grid container direction={"column"} justifyContent={"center"}>
                                <Grid item>
                                    <p>{first_name}</p>
                                </Grid>
                                <Grid item>
                                    {last_name}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs>
                            <Grid container direction={"column"} alignItems={"flex-end"}>
                                <p>{moment(feed.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</p>
                            </Grid>
                        </Grid>
                        <Grid item container style={{marginTop: "20px"}}>
                            <p>{feed.text}</p>
                        </Grid>
                    </Grid>
                    <Divider style={{width: "100%", background: "black", height: "2px"}}/>
                    {!feed.reply &&
                    <Grid item style={{marginTop: "20px"}} container direction={"column"}>

                        <Grid item>
                            <p>Reply:</p>
                        </Grid>
                        <Grid item style={{marginTop: "5px"}}>
                            <Input
                                type="text"
                                value={replyText}
                                className="w-100"
                                name="first_name"
                                pattern="^[a-zA-Z]*$"
                                title="First name should only contain alphabetic charaters. e.g. john"
                                onChange={onChangeReply}
                            />
                        </Grid>
                        <Grid item style={{background: "5px"}} onClick={updateFeedback}>
                            <button className={`btn btn-sm btn-success mt-3`} style={{opacity:replyText.length===0?0.7:1}}>
                                Reply
                            </button>
                        </Grid>
                    </Grid>
                    }
                    {
                        feed.reply &&
                        <Grid item style={{marginTop: "20px"}} container direction={"column"}>

                            <Grid item>
                                <p>Reply:</p>
                            </Grid>

                            <Grid item style={{background: "5px"}}>
                                <p>{feed.reply}</p>
                            </Grid>
                        </Grid>
                    }
                </Paper>
            </Grid>
            {(index+1)%2===1 && <Grid item xs={1}></Grid>}
        </Fragment>
    )
}


const UserFeedback = (props) => {
    const urlPathName = window.location.pathname.split('/')
    const userId = urlPathName[urlPathName.length - 1]
    const [feedback, setFeedback] = useState([]);


    const getFeedback = async () => {
        let result = await getUserFeedback(`users/${userId}/feedback`)
        setFeedback(result);
    }

    useEffect(() => {
        getFeedback();
        updateUsersList();

    }, [userId])



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
        props.history.push(`/userFeedback/${userId}`)
    }

    const onClickNext = (e) => {
        const userId = incDecCounter(true);
        props.history.push(`/userFeedback/${userId}`)
    }

    const FeedbackContainer = feedback.map((feed,index) =>
        <FeedbackItemContainer feed={feed} index={index} getFeedback={getFeedback}/>
    )


    return (
        <div className="row animated fadeIn">
            <Grid container justifyContent={"space-between"} style={{padding: "20px",justifyContent:"space-between"}}>
                <Grid item style={{cursor: "pointer"}} onClick={onClickPrev}>
                    <ArrowBackIcon/>
                </Grid>
                <Grid item style={{cursor: "pointer"}} onClick={onClickNext}>
                    <ArrowForwardIcon/>
                </Grid>
            </Grid>
            <Grid container>
            {FeedbackContainer}
            </Grid>
        </div>
    )
}

export default UserFeedback;