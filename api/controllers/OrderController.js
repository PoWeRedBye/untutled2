'use strict';

const { AxiosService } = require('./AxiosController');

exports.handleAxiosResponseError = error => {
    if (error.response.status === 401 || error.response.status === 400) {
        return {
            code: error.response.status,
            msg: error.response.data.message,
        };
    } else {
        return {
            code: 502,
            msg: error.response.data,
        };
    }
};

exports.getResponseMessageAccordingToResponseCode = item => {
    switch (item.code) {
        case 200:
            return item.msg;
        case 500:
            return 'Internal server Error';
        case 501:
            return 'Stock Error';
        case 502:
            return 'Input Data given are wrong';
        case 503:
            return "Can't update/create data in your Database";
        case 504:
            return "Can't do the action";
        case 505:
            return 'Not found in your database';
        case 201:
            return 'No content';
    }
};

exports.validateCreateOrderResponse = response => {
    const validate = response.data;
    return validate.map(item => ({ code: item.code, msg: this.getResponseMessageAccordingToResponseCode(item) }));
};

exports.createOrder = async (req, res) => {
    const orders = req.body;
    return await AxiosService.post('/api/orderapi/order', orders, req)
        .then(response => {
            const validatedResponse = this.validateCreateOrderResponse(response);
            res.send({
                code: 200,
                data: validatedResponse,
            });
        })
        .catch(error => {
            const validatedError = this.handleAxiosResponseError(error);
            res.status(validatedError.code).send(validatedError);
        });
};

exports.getAllOrders = async (req, res) => {
    const url = req.url;
    return await AxiosService.get(url, req)
        .then(response => {
            res.send({
                code: 200,
                data: response.data,
            });
        })
        .catch(error => {
            const validatedError = this.handleAxiosResponseError(error);
            res.status(validatedError.code).send(validatedError);
        });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    return await AxiosService.post(
        '/login',
        {
            email: email,
            password: password,
        },
        req,
    )
        .then(response => {
            //README this "if" is needed to check user not found errors !!!
            if (response.data.status === 401) {
                res.status(response.data.status).send({
                    code: response.data.status,
                    msg: response.data.message,
                });
            } else {
                res.send({
                    code: 200,
                    data: response.data,
                });
            }
        })
        .catch(error => {
            const validatedError = this.handleAxiosResponseError(error);
            res.status(validatedError.code).send(validatedError);
        });
};

exports.updateShipping = async (req, res) => {
    const url = req.url;
    const { trackingUrl, trackingNumber } = req.body;
    return await AxiosService.post(
        url,
        {
            trackingUrl: trackingUrl,
            trackingNumber: trackingNumber,
        },
        req,
    )
        .then(response => {
            res.send({
                code: response.data.code,
                msg: response.data.msg,
            });
        })
        .catch(error => {
            const validatedError = this.handleAxiosResponseError(error);
            res.status(validatedError.code).send(validatedError);
        });
};

exports.cancelOrder = async (req, res) => {
    const url = req.url;
    return await AxiosService.post(url, {}, req)
        .then(response => {
            res.send({
                code: response.data.code,
                msg: response.data.msg,
            });
        })
        .catch(error => {
            const validatedError = this.handleAxiosResponseError(error);
            res.status(validatedError.code).send(validatedError);
        });
};
