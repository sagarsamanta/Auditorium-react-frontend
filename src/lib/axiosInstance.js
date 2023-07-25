import axios from 'axios';
import { API_ROOT, AUTH_USER_COOKIE } from './consts';
import { getCookie } from 'cookies-next';


const axiosInstance = axios.create({
    baseURL: API_ROOT,
    headers: {
        'Content-Type': 'application/json', // Adjust this based on your API's requirements
    },
});

// Custom method to make API calls
const Axios = (method, url, data = null, config = {}) => {
    if (config.authRequest && config.token) {
        config.headers = { ...axiosInstance.headers, ...config.headers, Authorization: `Bearer ${config.token}` };
    }
    return axiosInstance({
        method,
        url,
        data,
        ...config,
    });
};

export default Axios;
