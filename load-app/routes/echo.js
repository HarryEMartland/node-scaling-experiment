var express = require('express');
var router = express.Router();

router.get('/echo', function(req, res, next) {
  res.send(req.body);
});

module.exports = router;
