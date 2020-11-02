import {userService} from '../_services';

export const helper = {
    handleResponse,
    checkResponse,
    enqueueSuccessfulSnackbar,
    enqueueErrorSnackbar,
    appUrl
}

function handleResponse(response) {
    return response.text().then(async text => {
        const data = checkResponse(text);
        if (!response.ok) {
            return Promise.reject(data);
        }
        return data;
    });
}

function checkResponse(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return {
            type: 'error',
            message: e.toString()
        };
    }
}

function enqueueSuccessfulSnackbar(enqueueSnackbar, message){
    enqueueSnackbar(message, {
        variant: 'success'
    });
}

function enqueueErrorSnackbar(enqueueSnackbar, message){
    enqueueSnackbar(message, {
        variant: 'error'
    });
}

function appUrl(){
    return window.location.origin.toString();
}