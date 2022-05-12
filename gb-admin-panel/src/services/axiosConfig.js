import axios from 'axios';

const API = axios.create({
    baseURL: 'https://rocky-sierra-25987.herokuapp.com/',
    validateStatus: status => status >= 200
})

API.interceptors.request.use(req => {
    if (localStorage.getItem('token')) {
        req.headers.authorization = `${localStorage.getItem('token')}`;
    }
    return req;
})

export default API;
