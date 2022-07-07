const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpontFiles = ['./src/app.js']

swaggerAutogen(outputFile, endpontFiles).then(() => {
    require('./server.js')
})
