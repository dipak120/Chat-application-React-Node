import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete,
    addpassword,
    sendrequest: _sendRequest,
    getRequest: _getRequest,
    acceptRequest: _acceptRequest,
    deleteRequest: _deleterequest,
    getFriends: _getFriends,
    updateProfile: _updateProfile,
    getAllUsers: _getAllUsers,
    getUserProfile: _getUserProfile,
    _friendAction
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/userlist');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => {
                    dispatch(success());
                    history.push('/afterregistration');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function _updateProfile(users) {
    return dispatch => {
        dispatch(request(users));

        userService.updateProfile(users)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/profile');
                    dispatch(alertActions.success('Profile Update successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(users) { return { type: userConstants.LOGIN_REQUEST, user: users } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function addpassword(user) {
    return dispatch => {
        dispatch(request(user));

        userService.createPass(user)
            .then(
                user => {
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success(user));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.CREATEPASS_REQUEST, user } }
    function success(user) { return { type: userConstants.CREATEPASS_SUCCESS, user } }
    function failure(error) { return { type: userConstants.CREATEPASS_FAILURE, error } }
}

function _getAllUsers() {
    return dispatch => {
        dispatch(request());

        userService.getAllUsers()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALLUSERSLIST_REQUEST } }
    function success(users) { return { type: userConstants.GETALLUSERSLIST_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALLUSERSLIST_FAILURE, error } }
}

function _getUserProfile(id) {
    return dispatch => {
        dispatch(request());

        userService.getUserProfile(id)
            .then(
                users => dispatch(success(users)),
                error => {
                    dispatch(failure(error.toString()))
                    history.push('/userlist');
                }
            );
    };

    function request() { return { type: userConstants.GETUSERPROFILE_REQUEST } }
    function success(users) { return { type: userConstants.GETUSERPROFILE_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETUSERPROFILE_FAILURE, error } }
}

function getAll(loginid) {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

function _getRequest(loginid) {
    return dispatch => {
        dispatch(request());

        userService.getRequest()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

function _getFriends(id = null) {
    if (id == null) {
        const id = sessionStorage.getItem('userID');
    }
    return dispatch => {
        dispatch(request());

        userService.getFriends(id)
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}


// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}


function _friendAction(loginId, friend_id, data='friendAction') {
    return dispatch => {
        dispatch(request(loginId));

        userService.deleterequest(loginId,friend_id, data)
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}



function _deleterequest(loginId, friend_id, data='deleterequest') {
    return dispatch => {
        dispatch(request());

        userService.deleterequest(loginId,friend_id,data)
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

function _acceptRequest(senderid, friend_id) {
    return dispatch => {
        dispatch(request(senderid));
        userService.acceptRequest(friend_id)
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: userConstants.ACCEPT_REQUEST } }
    function success(users) { return { type: userConstants.ACCEPT_SUCCESS, users } }
    function failure(users, error) { return { type: userConstants.ACCEPT_FAILURE, users, error } }
}

function _sendRequest(id) {
    return dispatch => {
        dispatch(request());

        userService.sendRequest(id)
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.SEND_REQUEST } }
    function success(users) { return { type: userConstants.SEND_SUCCESS, users } }
    function failure(users, error) { return { type: userConstants.SEND_FAILURE, users, error } }
}