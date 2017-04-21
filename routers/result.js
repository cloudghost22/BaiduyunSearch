/**
 * Created by lwy on 2017-04-21.
 */

var express = require('express');
var router = express.Router();

router.get('/:name', function(req, res) {
    res.send('hello, ' + req.params.name);
});

module.exports = router;
