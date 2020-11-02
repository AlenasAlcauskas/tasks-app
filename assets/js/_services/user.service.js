import {helper} from '../_helpers';

export const userService = {
    login,
    register,
    logout
};

/**
 *
 * @param email
 * @param password
 * @returns {Promise<*>}
 */
async function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    };

    let response = await fetch(`${helper.appUrl()}/api/user/login`, requestOptions);
    return helper.handleResponse(response);
}

/**
 *
 * @param name
 * @param email
 * @param password
 * @returns {Promise<*>}
 */
async function register(name, email, password) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password})
    };

    let response = await fetch(`${helper.appUrl()}/api/user/register`, requestOptions);
    return helper.handleResponse(response);
}

/**
 *
 * @returns {Promise<*>}
 */
async function logout() {
    const requestOptions = {
        method: 'GET',
    };

    let response = await fetch(`${helper.appUrl()}/logout`, requestOptions);
    return helper.handleResponse(response);
}