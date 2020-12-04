var express = require('express');
var router = express.Router();

/* Root route */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
