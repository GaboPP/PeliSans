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

router.post('/entrada',(req, res)=>{
    var query = "INSERT INTO peliculas (titulo, comentario, fecha_estreno) VALUES('"+req.body.titulo+"', '"+req.body.comentario+"', '"+req.body.Fecha+"')";
    db.query(query, function(err, rows){
        if(err){
            res.status(500).send({
                body:{
                    result:"error"
                }
            });
        }
        else{
            return res.status(200).send({
                body:{
                    result:"OK"
                }
            });
        }
    });
});

module.exports = router;