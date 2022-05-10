const express = require('express');
const {
    profile,
    connectWallet,
    disconnectWallet,
    getBalance,
    mytransactions,
    transferToWallet
} = require('../controllers/user.controler');
const { validate } = require('../helpers/jwt.helper');
const router = express.Router();

router.get('/me', profile);
router.post('/connect', connectWallet);
router.patch('/disconnect', disconnectWallet);
router.get('/balance', getBalance);
router.get('/transaction', mytransactions);
router.get('/transfer', transferToWallet);

const userRouter = (app) => {
    app.use('/users', validate, router);
};

module.exports = userRouter;
