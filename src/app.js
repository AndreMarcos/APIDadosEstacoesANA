const express = require('express');
const app = express();
const {InfluxDB} = require('@influxdata/influxdb-client')

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    next();
})

app.use(express.json());


// InfluxDB verificaçõ de integridade
const {HealthAPI} = require('@influxdata/influxdb-client-apis')
const url = 'http://200.98.74.81:8086'
const token = 'aLkpwadc4JhjtsavVjMaGow9ir4UhGoiYc4nz_Q0NguK74Q0wmuiIqFt9sMTAVNek09KKvUMs7vVh-BssORHnQ=='
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

app.get('/', (req, res) => {
    res.send('API rodando na porta 3000')
})

const RequireEstacoes = require('./routes/estacoes-router')
app.use('/estacoes', RequireEstacoes)

module.exports = app