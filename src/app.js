const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

const customerFile = require('./api/customer')
const purchaseFile = require('./api/purchase')
const turnoverFile = require('./api/turnover')

app.get('/mspr-ci/customers/:idCustomer', (req, res) => {
  
  customerFile
    .getCustomerById(req.params.idCustomer)
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.send(err);
    })
});

app.get('/mspr-ci/customers', (req, res) => {
  
  customerFile
    .getCustomers()
    .then(result => {
      res.json(result)
    }).catch(err => {
      res.send(err)
    })
});

app.post('/mspr-ci/customers', (req, res) => {

  customerFile
    .addCustomer(req.body.firstname, req.body.lastname)
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.send(err)
    })
})

app.get('/mspr-ci/purchases/:idCustomer', (req, res) => {
  
  purchaseFile
    .getPurchasesByCustomerId(req.params.idCustomer)
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.send(err)
    })
});

app.post('/mspr-ci/purchases',(req, res) => {

  purchaseFile
    .addPurchase(req.body.customer_id, req.body.product, req.body.quantity, req.body.unitPrice)
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.send(err)
    })
})

app.get('/mspr-ci/turnovers', (req, res) => {
  
  turnoverFile
    .getTurnovers()
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.send(err)
    })
});


// Swagger
let swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

app.use('/mspr-ci/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Fin Swagger

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
