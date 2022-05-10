const authRouter = require('./auth.route');
const binRouter = require('./bin.route');
const userRouter = require('./users.route');

const router = (app) => {
    userRouter(app);
    authRouter(app);
    binRouter(app);
};

module.exports = router;
