import React, {useState} from 'react';
import {
    Avatar,
    Button,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    CssBaseline
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {userService} from '../_services';
import { useHistory } from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {helper} from '../_helpers';
import {SignInStyle} from '../_styles';

export const SignIn = () => {
    
    const classes = SignInStyle();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [credentials, setCredentials] = useState({});

    const handleRegistrationField = ({target : {name, value}}) => {
        setCredentials({...credentials, [name]: value})
    };

    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        name='email'
                        autoComplete='email'
                        autoFocus
                        onChange={handleRegistrationField}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                        onChange={handleRegistrationField}
                    />
                    <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        className={classes.submit}
                        onClick={() => {
                            const {email, password} = credentials;
                            userService.login(email, password).then(response => {
                                if (response?.success){
                                    helper.enqueueSuccessfulSnackbar(enqueueSnackbar, 'Signed in');
                                    response?.redirect && history.push(response.redirect);
                                }
                            }, error => helper.enqueueErrorSnackbar(enqueueSnackbar, error?.message))
                        }}
                    >
                        Sign In
                    </Button>
                    <Grid container justify={'flex-end'}>
                        <Grid item>
                            <Link component={'button'} onClick={() => history.push('/signup')} variant='body2'>
                                {'Sign Up'}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}