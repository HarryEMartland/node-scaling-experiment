const express = require('express');
const router = express.Router();
const os = require('os');

router.get('/delay/:time', function (req, res, next) {

    setTimeout(() => {
        res.send({time: req.params.time, hostname: os.hostname()});
    }, req.params.time)

});


module.exports = router;
