const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const { AxiosTheAgent } = require('./api/controllers/AxiosClass');
const agent = require('./api/controllers/OrderController');

app.use((req, res, next) => {
    if (req.url !== '/login' && req.headers['x-access-token'] === undefined) {
        res.status(401).send({ code: 401, msg: 'No Token' });
    } else {
        next();
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    if (res.error) {
        console.log(res.error);
    }
    res.status(500).send('wtf....');
});

app.get('/api/orderapi/order', agent.getAllOrders);
app.post('/login', agent.login);
app.post('/api/orderapi/order', agent.createOrder);
app.route('/api/orderapi/order/:idMpOrder/shipping').post(agent.updateShipping);
app.get('/api/orderapi/order/:idMpOrder/cancel', agent.cancelOrder);

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' });
});

const server = app.listen(PORT, () => {
    console.log('http://localhost:' + PORT);
});
console.log('todo list RESTful API server started on: ' + PORT);
