import React, {Fragment, useEffect, useState} from 'react';
import {TasksPageStyle} from '../../_styles';
import {
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Fab,
    Box,
    Tooltip
} from '@material-ui/core';
import {AccountCircle, Add} from '@material-ui/icons';
import {useHistory} from 'react-router-dom';
import {taskService, userService} from '../../_services';
import {useSnackbar} from 'notistack';
import {TasksTable} from './TasksTable';
import {helper} from '../../_helpers';
import {CreateTaskDialog} from './CreateTaskDialog';
import {format} from 'date-fns';

export const Tasks = () => {

    const classes = TasksPageStyle();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [task, setTask] = useState({'date': format(new Date(), 'yyyy-MM-dd')});
    const [tasks, setTasks] = useState([]);
    const menuOpen = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const fetchUserTasks = () => {
        taskService.getTasks().then(response => setTasks(response),
            error => helper.enqueueErrorSnackbar(enqueueSnackbar, error?.message));
    };

    const taskEditHandler = ({target: {id, value}}) => {
        setTask({...task, [id]: value});
    };

    const logOut = () => {
        userService.logout().then(() => {
            helper.enqueueSuccessfulSnackbar(enqueueSnackbar, 'Logged out');
            history.push('/login');
        });
    };

    const saveTask = () => {
        taskService.createTask(task).then(r => {
            helper.enqueueSuccessfulSnackbar(enqueueSnackbar, 'Successfully created');
            fetchUserTasks();
        }, error => {
            helper.enqueueErrorSnackbar(enqueueSnackbar, `Error: ${error.message}`);
        });
    };

    useEffect(() => fetchUserTasks(), []);

    return (
        <Fragment>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h6' className={classes.title}>
                        Tasks
                    </Typography>
                    {auth && (
                        <div>
                            <IconButton
                                aria-label='account of current user'
                                aria-controls='menu-appbar'
                                aria-haspopup='true'
                                onClick={handleMenu}
                                color='inherit'
                            >
                                <AccountCircle/>
                            </IconButton>
                            <Menu
                                id='menu-appbar'
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                open={menuOpen}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => logOut()}>Log Out</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Box className={classes.box}>
                {tasks && <TasksTable classes={classes} tasks={tasks} fetchTasks={fetchUserTasks}/>}
                {createDialogOpen && <CreateTaskDialog
                    classes={classes}
                    dialogOpen={createDialogOpen}
                    setDialogOpen={setCreateDialogOpen}
                    taskEditHandler={taskEditHandler}
                    saveTask={saveTask}
                    task={task}
                    setTask={setTask}
                />
                }
                <Tooltip title={'Create a task'} placement={'left'}
                         children={<Fab color='primary' className={classes.fab}
                                        onClick={() => setCreateDialogOpen(true)}>
                             <Add/>
                         </Fab>}
                />
            </Box>
        </Fragment>
    );
};
