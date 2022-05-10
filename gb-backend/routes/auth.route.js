const express = require('express');
const { login } = require('../controllers/auth.controller');
const router = express.Router();
const { validateFirebaseToken } = require('../helpers/firebaseHelper');

router.post('/', validateFirebaseToken, login);

const authRouter = (app) => {
    app.use('/auth', router);
};

module.exports = authRouter;
