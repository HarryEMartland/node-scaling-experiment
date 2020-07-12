var express = require('express');
var router = express.Router();

router.get('/fib/:number', function(req, res, next) {
  res.send({fib:fibonacci(req.params.number)});
});

function fibonacci(num) {
  if (num <= 1) return 1;

  return fibonacci(num - 1) + fibonacci(num - 2);
}

module.exports = router;
