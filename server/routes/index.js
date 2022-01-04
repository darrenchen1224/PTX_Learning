var express = require('express');
var router = express.Router();
const api = require('../modules/api');

router.get('/getBusinfo', api.getBusinfo);
router.get('/getStopinfo/:busName/:dircrtion', api.getStopinfo);

module.exports = router;
