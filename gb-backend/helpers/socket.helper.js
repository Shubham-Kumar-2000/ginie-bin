const UserJwtHelper = require('./jwt.helper');
const BinJwtHelper = require('./bin.jwt.helper');

exports.socketUserAuth = (socket, next) => {
    const token = socket.handshake?.query?.authorization;
    if (!token) return next(new Error('Auth token not provided'));
    UserJwtHelper.verify(token)
        .then((user) => {
            socket.user = user;
            next();
        })
        .catch((e) => {
            next(new Error(String(e)));
        });
};

exports.socketBinAuth = (socket, next) => {
    const token = socket.handshake?.query?.authorization;
    if (!token) return next(new Error('Auth token not provided'));
    BinJwtHelper.verify(token)
        .then((bin) => {
            socket.bin = bin;
            next();
        })
        .catch((e) => {
            next(new Error(String(e)));
        });
};
