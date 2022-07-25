const conn = require('../app');
const xmlToJson = require('xml-js');
const https = require('https');

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

exports.getEstacao = async (req, res) => {
    const subscrible = {
        id: req.body.id,
        timeIn: req.body.timeIn,
        timeFin: req.body.timeFin
    }

    https.get('https://telemetriaws1.ana.gov.br/ServiceANA.asmx/DadosHidrometeorologicos?codEstacao=' + subscrible.id + '&dataInicio=' + subscrible.timeIn + '&dataFim=' + subscrible.timeFin, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        })
        resp.on('end', () => {
            const json = xmlToJson.xml2json(data, {
                compact: true,
                spaces: 4
            });

            let JsonParsed = JSON.parse(json)
            JsonParsed = JsonParsed["DataTable"]
            JsonParsed = JsonParsed["diffgr:diffgram"]
            JsonParsed = JsonParsed["DocumentElement"]
            JsonParsed = JsonParsed["DadosHidrometereologicos"]
            size = JsonParsed.length
            

            let response = {
                idEstacao : JsonParsed[0].CodEstacao._text,
                Dados: []
            }

            // let responseJSON = [{
            //     id : JsonParsed[0].CodEstacao._text,
            // }]

            for(let i = 0; i < size; i++){
                response.Dados.push({
                    DataHora : JsonParsed[i].DataHora._text,
                    Vazao : JsonParsed[i].Vazao._text,
                    Nivel : JsonParsed[i].Nivel._text,
                    Chuva : JsonParsed[i].Chuva._text
                })
            }

            res.send(response)
        })
    }).on('error', (err) => {
        console.log('Error: ' + err.message)
        res.send('Error: ' + err.message)
    })

}