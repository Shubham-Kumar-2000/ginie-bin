const socketIo = require('socket.io');
const { handleBinSocket } = require('../controllers/bin.controller');
const { handleScoket } = require('../controllers/user.controler');
const { socketBinAuth, socketUserAuth } = require('../helpers/socket.helper');

exports.socketRouter = (server, app) => {
    const io = socketIo(server, { cors: { origin: '*' } });

    io.of('/bin')
        .use(socketBinAuth)
        .on('connection', (socket) => handleBinSocket(socket, io));

    io.of('/user')
        .use(socketUserAuth)
        .on('connection', (socket) => handleScoket(socket, io));

    app.set('io', io);
};
