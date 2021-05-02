import { authHeader } from '../_helpers';
import { constant } from '../constant';
import axios from 'axios';
const API_ROOT = constant.ENV_PORT2;
axios.defaults.baseURL = API_ROOT;

export const userService = {
    login,
    logout,
    register,
    getAll,
    // getById,
    update,
    delete: _delete,
    createPass,
    sendRequest: _sendRequest,
    getRequest: _getRequest,
    acceptRequest: _acceptRequest,
    deleterequest: _deleterequest,
    getFriends: _getFriends,
    updateProfile: _updateProfile,
    getAllUsers: _getAllUsers,
    getUserProfile: _getUserProfile
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };
    return fetch(constant.ENV_PORT2 + `/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('userID', user._id);
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userID');
    sessionStorage.clear();

}

function _getAllUsers() {
    let users = JSON.parse(sessionStorage.getItem('user'));
    const id = sessionStorage.getItem('userID')
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users.id)
    };

    return axios.post(`/users`, { id: users.id })
        .then(res => { return res.data.data })
}

function _getUserProfile(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(constant.ENV_PORT2 + `/users/getUserProfile/${id}`, requestOptions).then(handleResponse);

}

function getAll() {
    const id = sessionStorage.getItem('userID')
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(constant.ENV_PORT2 + `/users/${id}`, requestOptions).then(handleResponse);
}

function _getRequest() {
    const id = sessionStorage.getItem('userID')
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(constant.ENV_PORT2 + `/users/request/${id}`, requestOptions).then(handleResponse);
}

function _getFriends(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(constant.ENV_PORT2 + `/users/getfriends/${id}`, requestOptions).then(handleResponse);
}

// function getById(id) {
//     const requestOptions = {
//         method: 'GET',
//         headers: authHeader()
//     };

//     return fetch(constant.ENV_PORT2+`/users/${id}`, requestOptions).then(handleResponse);
// }

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(constant.ENV_PORT2 + `/users/register`, requestOptions).then(handleResponse);
}

function _updateProfile(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(constant.ENV_PORT2 + `/users/updateprofile`, requestOptions).then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('userID', user._id);

            return user;
        });
}

function createPass(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(constant.ENV_PORT2 + `/users/addPassword`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(constant.ENV_PORT2 + `/users/${user.id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(constant.ENV_PORT2 + `/users/${id}`, requestOptions).then(handleResponse);
}

function _deleterequest(loginId,friend_id,action) {
    const data = {
        loginId,
        id: friend_id,
        action
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(constant.ENV_PORT2 + `/users/deleterequest`, requestOptions).then(handleResponse);
}

function _acceptRequest(friend_id) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: friend_id,
        })
    };

    return fetch(constant.ENV_PORT2 + `/users/acceptRequest`, requestOptions).then(handleResponse);
}

function _sendRequest(receiverid, senderid = sessionStorage.getItem('userID')) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            senderid,
            receiverid,
            status: false
        })
    };

    return fetch(constant.ENV_PORT2 + `/users/sendRequest`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                // location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}