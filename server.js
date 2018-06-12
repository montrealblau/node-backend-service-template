const http = require('http');
const environmentfile = require('./environmentfile.json');
const app = require('./app');


const port = environmentfile.PORT;
const server = http.createServer(app);
server.listen(port);