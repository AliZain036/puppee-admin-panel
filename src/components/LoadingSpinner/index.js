import React, {Component} from "react";
import {CircularProgress, Paper, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {styles} from "./styles";
import PropTypes from "prop-types";

class LoadingSpinner extends Component {
    loadingRef = React.createRef();
    state = {
        sizeVariants: {
            large: {spinnerSize: 50, variant: "h3"},
            default: {spinnerSize: 40, variant: "h4"},
            small: {spinnerSize: 30, variant: "h5"}
        }
    };

    componentDidMount() {
        const {classes, size} = this.props;
        if (size !== "large") this.loadingRef.current.parentNode.classList.add(classes.onParentDiv);
    }

    componentWillUnmount() {
        const {classes, size} = this.props;
        if (size !== "large") this.loadingRef.current.parentNode.classList.remove(classes.onParentDiv);
    }

    render() {
        const {classes, loading, size, text, ...rest} = this.props;
        const {spinnerSize, variant} = this.state.sizeVariants[size];
        const currentParentDiv =
            size === "large" //if size = large -> position=fixed, else -> position=absolute
                ? `${classes.parentDiv} ${classes.largeParentDiv}`
                : `${classes.parentDiv} ${classes.defaultParentDiv}`;
        const showLoading = loading ? "show" : "";
        return (
            <Paper ref={this.loadingRef} component="div" className={`${currentParentDiv} ${showLoading}`}>
                <div className={classes.loadingContent}>
                    <CircularProgress size={spinnerSize} className={classes.loading} color="primary" {...rest} />
                    {!!text ? (
                        <Typography
                            variant={variant}
                            className={`${classes.textContent} ${classes[size]}`}
                            color="primary"
                            noWrap>
                            {text}
                        </Typography>
                    ) : null}
                </div>
            </Paper>
        );
    }
}

LoadingSpinner.propTypes = {
    loading: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired
};

LoadingSpinner.defaultProps = {
    loading: false,
    text: "Loading...",
    size: "large"
};

export default withStyles(styles)(LoadingSpinner);
