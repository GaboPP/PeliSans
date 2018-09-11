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
    var query = "INSERT INTO peliculas (titulo, comentario, fecha_estreno, calificacion) VALUES('"+req.body.titulo+"', '"+req.body.comentario+"', '"+req.body.Fecha+"', '"+req.body.calif+"')";
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

router.post('/entrada_d', (req, res, next) => {
    var ID = parseInt(req.body.id_peli);
    db.result( 'DELETE FROM peliculas WHERe id_peli = $1', ID)
      .then(function (result) {
        /* jshint ignore:start */
        res.status(200)
          .json({
            status: 'success',
            message: `Removed ${result.rowCount} peli`
          });
        /* jshint ignore:end */
      })
      .catch(function (err) {
        return next(err);
      });
  });
  

module.exports = router;