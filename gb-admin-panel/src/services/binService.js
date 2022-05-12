import API from "./axiosConfig";

const login = async (token) => {
    const response = await API.post(`/auth`, {},
        {
            headers: { Authorization: token }
        })
    localStorage.setItem('token', response.data.token);
}

const addBin = async (data) => {
    const response = await API.post(`/bin`, data);
    return response;
}

const getBin = async () => {
    const response = await API.get(`/bin`);
    return response;
}

const binService = {
    login, addBin, getBin
}

export default binService;
