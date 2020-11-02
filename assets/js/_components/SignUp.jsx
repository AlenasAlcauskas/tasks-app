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
import {SignInStyle} from '../_styles/'

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const SignUp = () => {
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [credentials, setCredentials] = useState({});
    const [error, setError] = useState({});
    const classes = SignInStyle();

    const handleRegistrationField = (event) => {
        const {target : {name, value}} = event;
        setCredentials({...credentials, [name]: value})
    };

    const validate = (credentials) => {
        if (!credentials?.name || credentials.name.length < 1) {
            setError({name: 'Name is required'});
            return false;
        }
        if (!credentials?.email || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            .test(credentials?.email)) {
            setError({email: 'Email format incorrect'});
            return false;
        }
        if (!credentials?.password || credentials.password.length < 5) {
            setError({password: 'Password has to contain at least 5 characters'});
            return false;
        }
        return true;
    };

    const registerUser = () => {
        {
            if (!validate(credentials)) return;

            const {name, email, password} = credentials;

            userService.register(name, email, password)
                .then(response => {
                    helper.enqueueSuccessfulSnackbar(enqueueSnackbar, 'Successfully created user');
                    if (response?.logInStatus === 200 && response?.redirect) {
                        helper.enqueueSuccessfulSnackbar(enqueueSnackbar, 'Signed in');
                        history.push(response.redirect);
                    }
                }, error => {
                    helper.enqueueErrorSnackbar(enqueueSnackbar, `Error: ${error.message}`);
                });
        }
    }

    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Sign up
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        id='name'
                        label='Name'
                        name='name'
                        autoFocus
                        onChange={handleRegistrationField}
                        error={!!error?.name}
                        helperText={error?.name}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        id='email'
                        name='email'
                        label='Email Address'
                        autoComplete='email'
                        onChange={handleRegistrationField}
                        error={!!error?.email}
                        helperText={error?.email}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                        onChange={handleRegistrationField}
                        error={!!error?.password}
                        helperText={error?.password}
                    />
                    <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        className={classes.submit}
                        onClick={() => registerUser()}
                    >
                        {'Sign Up'}
                    </Button>
                    <Grid container justify={'flex-end'}>
                        <Grid item>
                            <Link component={'button'} onClick={() => history.push('/login')} variant='body2'>
                                {'Sign in'}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
            </Box>
        </Container>
    );
}