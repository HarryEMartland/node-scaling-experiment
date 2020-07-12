var express = require('express');
var router = express.Router();

router.get('/delay/:time', function (req, res, next) {

    setTimeout(() => {
        res.send({time: req.params.time});
    }, req.params.time)

});


module.exports = router;
