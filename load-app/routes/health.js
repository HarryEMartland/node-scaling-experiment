var express = require('express');
var router = express.Router();

router.get('/health', function (req, res, next) {
        res.send({ok:true});
});

module.exports = router;
