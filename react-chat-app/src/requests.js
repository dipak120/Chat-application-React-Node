import axios from 'axios';
import { constant } from './constant';
// const API_ROOT = process.env.REACT_APP_SERVER_URI
const API_ROOT = constant.ENV_PORT2;
axios.defaults.baseURL = API_ROOT;

export const fetchUsers = () => {
    const id = '';
    let users = JSON.parse(sessionStorage.getItem('user'));
    return axios.post(`/users`, { id: users.id })
        .then(res => res.data.data)
}

