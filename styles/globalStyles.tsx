import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        fontSize: 20,
        color: '#333',
        padding: 10,
    },
    modalSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
    },
    modalBody: {
        marginBottom: 20,
    },
    modalItem: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    modalFooter: {
        alignSelf: 'flex-end',
        marginTop: 10,
        backgroundColor: '#007BFF',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalFooterText: {
        color: '#fff',
        fontSize: 16,
    },


    //confirm delete
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalText: {
        fontSize: 20,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalWarning: {
        fontSize: 14,
        color: 'red',
        marginBottom: 10,
    },
    steakStartDetails: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    disabledButton: {
        opacity: 0.5,
        borderColor: '#949799',
    },
    card: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#fff',
        shadowRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 5 },
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    steakCookDetails: {
        fontSize: 16,
    },
    details: {
        marginTop: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    tableContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        textAlign: 'center',
        padding: 15,
    },
    tableText: {
        flex: 1,
        borderColor: '#000',
        borderWidth: 1,
        textAlign: 'center',
        width: '100%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    actionButton: {
        borderColor: 'black',
        alignContent: 'center',
        borderWidth: 2,
        width: 20,
        margin: 5,
        borderRadius: 5,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        alignItems: 'center',
    },
    editButton: {
        borderColor: '#e3cf17',
    },
    deleteButton: {
        borderColor: '#c70404',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 8,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f9f9f9',
    },
    tableHeader: {
        flex: 1,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 4,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        color: '#555',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        textDecorationColor: 'red',
    },
    dropdown: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        justifyContent: 'center',
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#aaa',
    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#d9534f',
    },
    saveButton: {
        backgroundColor: '#5cb85c',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 15,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
    },
    fontAwesomeButton: {
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
    },
    badButton: {
        backgroundColor: '#d9534f',
    },
    goodButton: {
        backgroundColor: '#5cb85c',
    },
    goodButtonOutline: {
        borderColor: '#5cb85c',
    },
    badButtonOutline: {
        borderColor: '#c70404',
    },
    infoButtonOutline: {
        borderColor: '#029af2',
    },
    appTitle: {
        fontSize: 30,
        paddingHorizontal: 10,
        paddingVertical: 15,
        fontFamily: 'Avenir-Book',
        backgroundColor: '#575555',
        color: '#ffffff',
    },
    clearButtonContainer:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    clearButton: {
        flex: 0.35,
        marginBottom: 20,
        fontSize: 15,
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#d9534f',
        backgroundColor: '#d9534f',
        color: 'white',
    },
});

export default globalStyles;
