import { StyleSheet } from 'react-native';
import { theme } from './theme';

const globalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: theme.colors.white,
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
        color: theme.colors.text,
    },
    closeButton: {
        fontSize: 20,
        color: theme.colors.text,
        padding: 10,
    },
    modalSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme.colors.textMuted,
    },
    modalBody: {
        marginBottom: 20,
    },
    modalFooter: {
        alignSelf: 'flex-end',
        marginTop: 10,
        backgroundColor: theme.colors.info,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalFooterText: {
        color: theme.colors.white,
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalWarning: {
        fontSize: 16,
        color: theme.colors.danger,
        marginBottom: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: 16,
    },
    disabledButton: {
        opacity: 0.5,
        borderColor: '#949799',
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
        borderColor: theme.colors.danger,
    },

    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 45,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        textDecorationColor: theme.colors.danger,
    },
    dropdown: {
        height: 45,
        borderColor: theme.colors.border,
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
        color: theme.colors.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: theme.colors.danger,
    },
    saveButton: {
        backgroundColor: theme.colors.success,
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
        backgroundColor: theme.colors.danger,
    },
    goodButton: {
        backgroundColor: theme.colors.success,
    },
    infoButton: {
        backgroundColor: theme.colors.info,
    },
    goodButtonOutline: {
        borderColor: theme.colors.success,
        color: theme.colors.success,
    },
    badButtonOutline: {
        borderColor: theme.colors.danger,
    },
    infoButtonOutline: {
        borderColor: '#029af2',
    },
    infoButtonText: {
        color: '#029af2',
    },
    appTitle: {
        fontSize: 30,
        paddingHorizontal: 10,
        paddingVertical: 15,
        fontFamily: 'Avenir-Book',
        backgroundColor: '#575555',
        color: theme.colors.white,
    },
    card: {
        paddingTop: 10,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: theme.colors.card,
        shadowRadius: 5,
        shadowColor: theme.colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 5 },
    },
    dangerContainer: {
        backgroundColor: theme.colors.dangerDeep,
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
    },
    textDangerWhite: {
        color: theme.colors.white,
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 10,
    },
});

export default globalStyles;
