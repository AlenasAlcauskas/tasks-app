import React from 'react';
import {
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Dialog
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {format} from 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

export const CreateTaskDialog = (props) => {

    const {classes, dialogOpen, setDialogOpen, taskEditHandler, saveTask, task, setTask} = props;

    return <Dialog open={dialogOpen} onClose={() => {
        setDialogOpen(false);
        setTask({})
    }}>
        <DialogTitle id='form-dialog-title'>Create a task</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin='dense'
                id='title'
                label='Task title'
                type='text'
                fullWidth
                onChange={taskEditHandler}
            />
            <TextField
                margin='dense'
                id='comment'
                label='Task comment'
                type='text'
                fullWidth
                onChange={taskEditHandler}
                multiline
                rowsMax={4}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    id={'date'}
                    className={classes.dialogDatePicker}
                    clearable
                    fullWidth
                    name={'date'}
                    value={task.date}
                    onChange={(date) => {
                        let stringDate;
                        try {
                            stringDate = format(date, 'yyyy-MM-dd');
                            taskEditHandler({target: {id: 'date', value: stringDate}});
                        } catch (e) {
                        }
                    }}
                    format='yyyy-MM-dd'
                    autoOk
                    disableFuture
                />
            </MuiPickersUtilsProvider>
            <TextField
                margin='dense'
                id='time'
                label='Time spent (hours)'
                type='number'
                fullWidth
                onChange={taskEditHandler}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color='primary'>
                Cancel
            </Button>
            <Button onClick={() => {
                saveTask();
                setDialogOpen(false);
            }} color='primary'>
                Create
            </Button>
        </DialogActions>
    </Dialog>
};