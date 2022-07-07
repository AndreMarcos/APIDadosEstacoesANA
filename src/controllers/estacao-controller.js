const conn = require('../app');

exports.postEstacao = async (req, res) => {
    const subscrible = {
        name: req.body.name,
        dado: req.body.dado,
        timeIn: req.body.timeIn,
        timeFin: req.body.timeFin
    }

    const queryAPI = conn.getQueryApi('Rennosonic');

    const fluxQuery = `from(bucket: "MonitoramentoRioMadeira")
    |> range(start: time(v: \"${subscrible.timeIn}\")) 
    |> filter(fn: (r) => r._measurement == \"${subscrible.name}\")
    |> filter(fn: (r) => r["_field"] == \"${subscrible.dado}\")`

    dateResponse = []
    dataFlux = queryAPI.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
            const o = tableMeta.toObject(row)
            dataRow = {
                time: o._time,
                value: o._value,
                field: o._field
            }
            dateResponse.push(dataRow)
        },
        error: (error) => {
            console.error(error)
            console.log('\nErro na Consulta')
            res.send('\nErro na Consulta')
        },
        complete: () => {
            console.log('\nConsulta finalizada com sucesso')
            res.send(dateResponse)
        },
    })

}