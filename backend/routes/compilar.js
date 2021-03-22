var express = require('express');
var router = express.Router();
var parser = require('./analizador/gramatica');

router.post('/', function(req, res, next) {
    try {
        console.log(req.files.archivo.data.toString('utf-8'));
        parser.parse(req.files.archivo.data.toString('utf-8'));
        res.statusCode = 200;
        res.json({salida:""});
    }
    catch(e){
        console.log(e);
        res.statusCode = 200;
        res.json({salida:""});
    }
});

module.exports = router;