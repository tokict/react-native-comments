import { StyleSheet, PixelRatio } from "react-native";

const styles = StyleSheet.create({
    commentContainer: {
        paddingRight: 5,
        marginBottom: 10,
        flexDirection: "row"
    },
    left: {
        padding: 5
    },
    image: {
        height: 30,
        width: 30,
        borderRadius: 15
    },
    right: {
        flex: 1
    },
    rightContent: {
        borderRadius: 10,
        padding: 5,
        backgroundColor: "#f1f3f6"
    },
    rightContentTop: {
        flexDirection: "row"
    },

    name: {
        fontWeight: "bold",
        paddingBottom: 5
    },
    editIcon: {
        flex: 1,
        alignItems: "flex-end"
    },
    body: {
        paddingBottom: 10
    },
    rightActionBar: {
        paddingRight: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    time: {
        fontSize: 12,
        paddingLeft: 5,
        color: "#9B9B9B",
        fontStyle: "italic"
    },
    actionText: {
        color: "#9B9B9B",
        fontWeight: "bold"
    },
    repliedSection: {
        paddingTop: 15,
        paddingBottom: 20,
        width: 150,
        justifyContent: "space-between",
        flexDirection: "row"
    },
    repliedImg: {
        height: 20,
        width: 20,
        borderRadius: 10
    },
    repliedUsername: {
        color: "#9B9B9B"
    },
    repliedText: {
        color: "#9B9B9B"
    },
    repliedCount: {
        color: "#9B9B9B",
        fontSize: 11
    },
    inputSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    submit: {
        padding: 10
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
        color: "#424242"
    },
    likeNr: {
        fontWeight: "normal",
        fontSize: 12
    },
    likeHeader: {
        textAlign: "center",
        padding: 10,
        marginTop: 30,
        fontWeight: "bold"
    },
    likeButton: {
        margin: 10,
        alignItems: "center"
    },
    likeContainer: {
        padding: 10,
        width: 200,
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row"
    },
    likeImage: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
    likename: {
        fontWeight: "bold",
        fontSize: 14
    },
    editModalContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    editModal: {
        backgroundColor: "white",
        margin: 10,
        paddingTop: 10,
        width: "90%",
        height: 300,
        borderWidth: 2,
        borderColor: "silver"
    },
    editButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        height: 40,
        width: 80,
        paddingLeft: 5,
        paddingRight: 5,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "silver",
        borderRadius: 5,
        margin: 10
    },
    menu: {
        borderWidth: 1,
        borderColor: "silver",
        zIndex: 999,
        width: 200,
        right: 0,
        top: 0,
        backgroundColor: "white",
        position: "absolute"
    },
    menuItem: {
        padding: 10,
        height: 40,

        justifyContent: "center"
    },
    menuText: {
        textAlign: "center"
    }
});

export default styles;
