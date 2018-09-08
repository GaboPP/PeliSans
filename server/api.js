const express = require('express');
const router = express.Router();
const db = require('./config');


router.get('/', (req, res) =>{
    res.send('api works');
});

router.get('/entradas', (req, res, next) =>{
    db.any('SELECT * FROM peliculas')
        .then(function (data) {
            res.status(200)
            .json({
                status: 'success',
                data: data,
                message: 'retornadas todas las peliculas!'
            });
        })
    .catch(function (err) {
        console.log("ups algo ha salido mal :C")
        return next(err);
    });
});

module.exports = router;