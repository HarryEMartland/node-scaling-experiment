var express = require('express');
var router = express.Router();
const os = require('os');

router.get('/health', function (req, res, next) {
        res.send({ok:true, hostname: os.hostname()});
});

module.exports = router;
