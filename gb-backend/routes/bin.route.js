const express = require('express');
const { createBin, allBins } = require('../controllers/bin.controller');
const { validate } = require('../helpers/jwt.helper');
const { ensurePermission } = require('../helpers/permission.helper');
const router = express.Router();

router.post('/', validate, ensurePermission('admin'), createBin);
router.get('/', allBins);

const binRouter = (app) => {
    app.use('/bin', router);
};
module.exports = binRouter;
