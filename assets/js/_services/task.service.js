import {helper} from '../_helpers';

export const taskService = {
    createTask,
    getTasks,
    deleteTask
};

/**
 *
 * @param task
 * @returns {Promise<*>}
 */
async function createTask(task) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task)
    };

    let response = await fetch(`${helper.appUrl()}/api/task/create`, requestOptions);

    return helper.handleResponse(response);
}

/**
 *
 * @returns {Promise<*>}
 */
async function getTasks() {
    const requestOptions = {
        method: 'GET'
    };

    let response = await fetch(`${helper.appUrl()}/api/tasks/get`, requestOptions);

    return helper.handleResponse(response);
}

async function deleteTask(id) {
    const requestOptions = {
        method: 'DELETE'
    };

    let response = await fetch(`${helper.appUrl()}/api/task/${id}/delete`, requestOptions);

    return helper.handleResponse(response);
}