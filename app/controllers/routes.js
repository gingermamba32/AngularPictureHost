var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
    console.log(req.method, req.url);
    next();
});
router.get('/', function(req, res){
    res.sendFile('/Users/matthewcordeiro/Desktop/PCS-projects/FullPixel/public/partials/index.html');
    console.log('home page.');
});


module.exports = router;