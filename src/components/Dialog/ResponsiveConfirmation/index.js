import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {useSelector} from "react-redux";

 const ResponsiveConfirmationDialog=(props)=> {
    const [open, setOpen] = React.useState(true);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                onBackdropClick="false"
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent style={{minWidth:"320px"}}>
                    <DialogContentText>
                        {props.text}
                    </DialogContentText>
                    {props.children}
                </DialogContent>
                <DialogActions>
                    {props.buttons}
                    {props.otherButton}
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ResponsiveConfirmationDialog;