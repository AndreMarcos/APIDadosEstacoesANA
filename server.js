const app = require('./src/app')
const debug = require('debug')('nodestr:server')
const http = require('http')


const PORT = normalizePort(process.env.PORT || 5200)
const HOST = '0.0.0.0'

app.set('port', PORT)

const SERVER = http.createServer(app)
SERVER.listen(PORT, HOST)
SERVER.on('error', onError)
SERVER.on('listening', onListening)
console.log(`API executando em ${PORT}!`);

function normalizePort(val) {
    const port = parseInt(val, 10)

    if(isNaN(port)) {
        return val
    }
    if(port >= 0){
        return port
    }

    return false

}

function onError(error) {
    if(error.syscall !== 'listen'){
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe' + port : 'Port' + port;

    switch(error.code){
        case 'EACCES':
            console.error(bind + ' requer priviglégios de administrador');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' em uso');
            process.exit(1);
        default:
            throw error;
    }
}

function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe' + addr : 'port' + addr.port;
    debug('Ouvindo na porta ' + bind);
}





