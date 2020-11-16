export const styles = theme => ({
    onParentDiv: { position: "relative", overflow: "hidden" },
    largeParentDiv: {
        position: "fixed"
    },
    defaultParentDiv: {
        position: "absolute"
    },
    parentDiv: {
        zIndex: "999999999 !important",
        backgroundColor: "rgba(255,255,255,.8)",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        overflow: "hidden",
        visibility: "hidden",
        "&.show": {
            visibility: "visible",
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%"
        }
    },
    loadingContent: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        display: "inline-block"
    },
    textContent: {
        display: "inline-block",
        paddingLeft: "12px"
    },
    large: {
        fontSize: "2.5em",
        lineHeight: "1.6"
    },
    default: {
        fontSize: "2em",
        lineHeight: "1.4"
    },
    small: {
        fontSize: "1.5em",
        lineHeight: "1.2"
    }
});
