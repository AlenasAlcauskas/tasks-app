import {makeStyles} from '@material-ui/core/styles';

export const TasksPageStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    },
    fab: {
        marginTop: 20,
        marginBottom: 10,
        marginRight: 10,
        float: 'right'
    },
    box: {
        marginTop: 20,
        marginLeft: 40,
        marginRight: 40,
        paddingBottom: 40,
        position: 'relative'
    },
    dialogDatePicker: {
        marginTop: 10
    },
    tableToolbarSecondRow: {
        padding: '0px 24px'
    },
    tableDateFilterCheckbox: {
        marginLeft: 5
    },
    tableDateFilterDatePicker: {
        width: 150
    }
}));