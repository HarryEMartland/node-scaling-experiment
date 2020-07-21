const express = require('express');
const router = express.Router();
const os = require('os');

router.get('/delay/:time', function (req, res, next) {

    const startTime = new Date().getTime();

    setTimeout(() => {
        const endTime = new Date().getTime();

        res.send({
            time: req.params.time,
            hostname: os.hostname(),
            serverTimeTaken: endTime - startTime
        });
    }, req.params.time)

});


module.exports = router;
