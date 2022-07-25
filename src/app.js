const express = require('express');
const app = express();
const {InfluxDB} = require('@influxdata/influxdb-client')
require('dotenv/config');


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    next();
})

app.use(express.json());

// Documentação
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// InfluxDB verificaçõ de integridade
const {HealthAPI} = require('@influxdata/influxdb-client-apis')
const url = process.env.URL_DB
const token = process.env.TOKEN_DB
const conn = new InfluxDB({url, token})
const healthAPI = new HealthAPI(conn)

healthAPI.getHealth().then((result /* : HealthCheck */) => {
    console.log('\nSucesso na integridade da base de dados:')
    console.log(result.message)
    console.log(result.version)
})
.catch((error /* : Error */) => {
    console.log(error)
    console.log('\n Falha na integridade da base de dados')
})

module.exports = conn

const RequireEstacoes = require('./routes/estacoes-router')
app.use('/', RequireEstacoes)

module.exports = app