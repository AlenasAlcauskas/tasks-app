import React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation
} from 'react-router-dom';
import {SignUp, SignIn, Tasks} from './js/_components';
import {SnackbarProvider} from 'notistack';

export const App = () => {

    const routes = [
        {
            path: '/tasks',
            component: Tasks
        },
        {
            path: '/login',
            component: SignIn
        },
        {
            path: '/signup',
            component: SignUp
        },
        {
            path: '/',
            component: SignIn,
            exact: true
        },
        {
            path: '*',
            component: NoMatch
        }
    ];

    return (
        <Router>
            <Switch>
                {routes.map((route, i) => <Route key={i} {...route} />)}
            </Switch>
        </Router>
    );
};

const NoMatch = () => {
    const location = useLocation();

    return (
        <div>
            <h3>404: Page not found</h3>
            <h3><code>{location.pathname}</code>
            </h3>
        </div>
    );
};

render(
    <SnackbarProvider maxSnack={5} anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
    }}>
        <App/>
    </SnackbarProvider>
    , document.getElementById('root'));