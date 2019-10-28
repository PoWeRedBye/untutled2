const axios = require('axios');

exports.AxiosService = (() => {

    const axiosInstance = axios.create({
        baseURL: process.env.BASE_URL,
        headers: {
            common: {
                Accept: 'application/json, text/plain,',
                'Content-Type': 'application/json',
            }
        }
    });

    const setHeaders = request => {
        if (request.url !== '/login') {
            return {
                headers: {
                    'X-access-token': request.headers['x-access-token'],
                },
            };
        } else {
            return {
                headers: {
                    Referer: request.body.email,
                },
            };
        }
    };

    const GET = (endpoint, request) => {
        return axiosInstance.get(endpoint, setHeaders(request));
    };

    const POST = (endpoint, data, request) => {
        return axiosInstance.post(endpoint, data, setHeaders(request));
    };

    const PUT = (endpoint, data, request) => {
        return axiosInstance.put(endpoint, data, setHeaders(request));
    };

    const PATCH = (endpoint, data, request) => {
        return axiosInstance.patch(endpoint, data, setHeaders(request));
    };

    const DELETE = (endpoint, request) => {
        return axiosInstance.delete(endpoint, setHeaders(request));
    };
    return {
        get: GET,
        post: POST,
        put: PUT,
        patch: PATCH,
        delete: DELETE,
    };
})();
