const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/authentication.error');

exports.sign = (payload) => {
    return jwt.sign(payload, process.env.BIN_TOKEN_SECRET, {});
};

exports.verify = (token) =>
    new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.BIN_TOKEN_SECRET,
            function (err, decoded) {
                if (err) {
                    return reject(err.message);
                } else {
                    resolve(decoded);
                }
            }
        );
    });

exports.validate = (req, res, next) => {
    const token = req.headers['authorization'];
    // console.log(token);

    if (token) {
        exports
            .verify(token)
            .then((user) => {
                req.user = user;
                next();
            })
            .catch((err) => {
                // console.log(err);
                // return res.status(200).json({
                //     error: err,
                //     logout: true
                // });
                //next(new CustomError(String(err)));
                next(new AuthenticationError(String(err)));
            });
    } else {
        // return res.status(200).json({
        //     error: 'No token supplied',
        //     logout: true
        // });
        //next(new CustomError('No token supplied'));
        next(new AuthenticationError('No Token Supplied'));
    }
};
