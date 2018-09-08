# PeliSans
Aprendiendo a hacer un feed de películas, para la asignatura Analisis y Diseño de Software

# Stack
- PostgreSQL
- Express
- Angular-Cli
- Node.js
# Rutas del Proyecto
-PeliSans
    -e2e
    -server
        -api.js
        -config.js
    -src
        -app
            -app
                -card
                    -feed
                    -insert-peli
                    -navbar
                    -servicios
                    -app-routing.module.ts
                    -app.component.css
                    -app.component.html
                    -app.component.spec.ts
                    -app.component.ts
                    -app.module.ts
        -assets
            -images
                -ticket
        -environments
        -index.html
        -styles.css
        -archivos
    -server.js
    -[].json
    -README.md
# Creando la nueva aplicación
Primero creamos la app de Angular desde el terminal con el siguiente código:
~~~
ng new PeliSans --routing
~~~

# Instalando dependencias
- instala los modulos para la conexión con la base de datos **express** y **postgres**, también para la lectura del body instala **body-parser** con el siguiente comando:  
~~~
    npm i express pg-promise body-parser --save
~~~
# Creando la base de datos
~~~
CREATE TABLE public.peliculas
(
    id_peli bigint NOT NULL DEFAULT nextval('peliculas_id_peli_seq'::regclass),
    titulo character varying(200) COLLATE pg_catalog."default" NOT NULL,
    comentario character varying(1000) COLLATE pg_catalog."default",
    fecha_estreno date NOT NULL,
    CONSTRAINT pk_id_peli PRIMARY KEY (id_peli)
)
~~~
- generamos la BD en postgreSQL
- agrega los algunos datos a la BD


# Conectando la base de datos

- primero crearemos dentro de PeliSans una carpeta llamada server
- dentro de PeliSans/server creamos un archivo llamado config.js, con el siguiente codigo:
~~~ 
var pgp = require("pg-promise")(/*options*/);
var connection = pgp("postgres://username:password@host:port/database"); 
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 'port', //suele ser 5432,
  user: 'username',
  password: 'password',
  database: 'database',
})

client.connect((err) => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('conectado!')
    }
})

module.exports = connection;
~~~

# Creando un manejador

 En la misma carpeta PeliSans/server creamos un archivo llamado api.js dentro de el escribiremos el siguiente código:

 ~~~ 
    const express = require('express');
    const router = express.Router();


    router.get('/', (req, res) =>{
        res.send('api works');
    });

    module.exports = router;
 ~~~
Esto para crear un manejador de rutas montables y modulares, en este archivo podremos crear sistema de middleware y direccionamiento completo (una “miniaplicación”), dónde podremos comunicar informacion a nuestra página desde una API o una BD.

# Montando el entorno Web

- En PeliSans crea el archivo server.js, con el siguiente código
~~~ 

/* Librerias */
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

/* Incluimos la Api*/
const api = require('./server/api');

/*Crear App de Express*/
const app = express();

/* Parser para POST */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Static Path */
app.use(express.static(path.join(__dirname, 'dist')));

/* Ruta para nuestra API */
app.use('/api/v1', api);

/* Todas las rutas no dirigídas a la API se las enviamos a angular */
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/* Setear el puerto donde se escucharán las peticiones */
const port = process.env.PORT || '3000';
app.set('port', port);

/* Levantamos el servidor */
const server = http.createServer(app);
server.listen(port,()=> console.log(`API corriendo en el puerto:${port}`));

~~~ 

- ahora podemos ver que la web esta corriendo con el comando `node server` por el terminal, y luego en el navegador dirígete a la dirección `localhost:3000/api/v1/`

# Integrando la Base de Datos

Para lograr integrar la base de datos a nuestra aplicación, nos serviremos de nuestro archivo **config.js**, así que vamos a `PeliSans/server/api.js` e importamos config: 

~~~ 
    const db = require('./config');
~~~ 

- Luego para obtener las entradas de la base de datos generamos una ruta o EndPoint, entonces agrega sobre `module.exports = router;` el siguiente código:
~~~ 
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
~~~ 
- any es para retornar cualquier numero de resultados (tambien existe one/many/none/result para mas [info])

- ahora si podemos ver los datos obtenidos de la base de datos, ejecuta el comando `node server` por el terminal, y luego en el navegador dirígete a la dirección [localhost:3000/api/v1/entradas], ahí se verán los registros obtenidos.

# Componentes

Para poder ver los datos de una forma mas ordenada y con estilo, trabajaremos con Angular-Cli, para esto crearemos el componente feed, para esto ejecutamos la siguiente instrucción:

~~~ 
ng generate component feed
~~~ 

- Con el comando ``generate component`` angular crea automáticamente componentes en la carpeta PeliSans/src/app/**Componente**, por lo que se generará una carpeta feed con los siguientes archivos:

~~~ 
entradas.component.css <--- Hoja de estilo CSS del componente
entradas.component.html <--- Plantilla del componente
entradas.component.ts <--- Clase Componente
~~~ 

# Rutas
 
Para agregar la ruta que nos direccionara a nuestro feed en la aplicación, nos dirigímos a `PeliSans/src/app/app-routing.module.ts`, importamos nuestro feed, y agregamos su ruta:
~~~ 
    import { FeedComponent } from './feed/feed.component';

    const routes: Routes = [
        { path: '', component: FeedComponent }];
~~~ 

# Servicios

Para lograr suministrar los datos de la API a los componentes, se necesita crear los services, primero creamos la carpeta servicios y dentro de ella generamos el servicio, con el siguiente comando:

~~~ 
ng generate service entradas
~~~ 

- En entradas.service.ts importamos los modulos **http** y **map** en el caso de tener problemas de compatibilidad con el map usar `npm install rxjs-compat`
- Inyectamos Http en el constructor del servicio.
- creamos una función para obtener los datos de la API

~~~ 
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

constructor(private http: Http) { }

getEntradas(){
  return this.http.get('/api/v1/entradas').map(res => res.json());
};

~~~ 

- Para que el servicio suministre a los componentes debemos importarlo en `PeliSans\src\app\app.module.ts`, con el modulo Http para los requests: 
~~~ 
import { HttpModule } from '@angular/http';
import { EntradasService } from './servicios/entradas.service';
~~~ 

declaramos a nuestro servicio como proveedor y todas las importaciones **DEBEN** ser declaradas en el import:
~~~ 
imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
  ],
  providers: [EntradasService],
~~~ 

# Mostrando Datos

Primero nos dirigímos a nuestro feed, en `\src\app\feed\feed.component.ts` ahí importamos el servicio que suministrara nuestros datos

~~~ 
    import { EntradasService } from '../servicios/entradas.service';
~~~

Luego:
* creamos un array que almacene nuestras Peliculas 
* inicializamos el servicio en el constructor
* creamos un funcion dentro de Oninit para rescatar los datos al empezar la aplicación

~~~
    Peliculas: any = [];
    constructor(private entradasService: EntradasService) { }

    ngOnInit() {
    this.entradasService.getEntradas().subscribe(rows =>{
      this.Peliculas = rows.data;
      console.log(this.Peliculas);
    });
  }

~~~

Por último nos vamos al html de feed, en `\src\app\feed\feed.component.html` e iteramos para mostrar cada pelicula

~~~    
    <ul *ngFor="let entrada of Peliculas">
        <h1> {{ entrada.titulo }} </h1>
        <p> {{ entrada.comentario }} <p>
        <h4> {{ entrada.fecha_estreno | date:'hh:mm dd/MM/yyyy'}} </h4>
    </ul>
~~~

Si ejecutamos el proyecto (`ng build; node server`) podremos ver los datos en pantalla, en `localhost:3000`.

# Boostrap

Ahora vamos añadirle estilo a nuestra página, para eso instalaremos el framework de css, **Bootstrap**, para esto partiremos instalando boostrap:

~~~
    npm install bootstrap
~~~

- luego para suministrar bootsatrap globalmente a nuestra API, debemos ir a `PeliSans/angular.json` e instaurar las dependencias:

~~~
    "styles": [
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "src/styles.css"
        ],
    "scripts": [
        "node_modules/bootstrap/dist/js/bootstrap.min.js"
        ]
~~~
- Para tus usos futuros, en **styles** se importan tus estilos globales, si quieres aplicar código css en todo tu proyecto busca  `src/styles.css` y lograrás administrar estilos globales, lo anterior también es válido para tu scripts o funciones, pero la importación es en **scripts**.

- tambien agregamos los links de las dependencias en `PeliSans/app/index.html`, los estilos de css van en el <head> y scripts en el <body>
~~~
<head>
    //...
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</head>

<body>
  <app-root></app-root>
    
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
~~~

### Odenando

Para lograr definir un esquema y orden crearemos dos nuevos componentes **card** y **navbar**

~~~
    ng g c card
    ng g c navbar
~~~
Luego,
- Desplazaremos todo el script que escribimos en feed a card, quedando:

~~~
    import { Component, OnInit } from '@angular/core';
import { EntradasService } from '../servicios/entradas.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  
  Peliculas: any = [];
  constructor(private entradasService: EntradasService) { }

  ngOnInit() {
    this.entradasService.getEntradas().subscribe(rows =>{
      this.Peliculas = rows.data;
      console.log(this.Peliculas);
    });
  }

}
~~~

- en `feed.component.html` insertamos la etiqueta de nuestro componente card y aprovechamos de insertar la de nuestra navbar
~~~
    <app-navbar></app-navbar>
    <app-card></app-card>
~~~

Luego en `card.component.html` insertamos el código de un card de bootsrap (modificado para nuestras necesidades):

~~~
<div class="container">
<br><br>
<ul *ngFor="let entrada of Peliculas">
  <div class="row">
      <div class="col md-6">
          <div class="card">
            <div class="card-header">
              <h1> {{ entrada.titulo }} </h1>
            </div>
            <div class="card-body">
              <blockquote class="blockquote mb-0">
                  <p> {{ entrada.comentario }} <p>
                <footer class="blockquote-footer">Estreno: <cite title="Source Title">
                  {{ entrada.fecha_estreno | date:'hh:mm dd/MM/yyyy'}} 
                </cite></footer>
              </blockquote>
            </div>
          </div>
        </div> 
      <br>
  </div>
</ul>
</div>
~~~

Y creamos una navbar, para ello sacamos el código de boostrap y lo insertamos en `navbar.component.html`:

~~~
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="entradas/new">Ingresar Pelis</a>
          </li>
        </ul>
      </div>
</nav>
~~~

# Insertar Peliculas

Ahora vamos a hacer inserciones a la base de datos mediante un formulario, para ello primero generaremos un componente:

~~~
    ng g c insert_peli
~~~

En su html vamos a copiar un form de bootstrap y modificarlo para nuestros fines:

~~~
<app-navbar></app-navbar>
<br><br>
<div class="row align-items-center">
  <div class="col-md-4"></div>
  <div class="col md-6 ">
    <form>
        <div class="form-row ">
            <div class="form-group col-md-6 disenno">          
                <h4>Titulo</h4>
                <input type="text" class="form-control" placeholder="Titulo" [(ngModel)]="Titulo" name="titulo">
                <br>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-6 disenno">
              <h4>Comentario</h4>
              <input type="text" class="form-control" placeholder="Comentario" [(ngModel)]="Comentario" name="comentario">
              <br>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-6 disenno">
                <h4>Fecha de Estreno</h4>
                <input type="date" class="form-control" placeholder="Fecha" [(ngModel)]="Fecha" name="Fecha">
                <br>
            </div>
        </div>
        <button type="submit" class="btn btn-primary" (click)="insert()" >Send</button>
    </form>
  </div>
  <div class="col-md-1"></div>
</div>
~~~
-Para lograr hacer el bind en los forms de ngModel importamos Forms en `app.component.ts`

~~
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LogComponent,
    CardComponent,
    FeedComponent,
    NavbarComponent,
    InsertPeliComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule
  ],
~~
Ahora crearemos el script que rescatara los datos y los procesará
- primero debemos crear la función en ``entradas.service.ts`` que al ser invocada, envíe los datos a insertar a la API.

~~~
insertEntrada(data){
  return this.http.post('/api/v1/entrada', data).map(res => res.json());
}
~~~

- Ahora importamos en nuestro `insert-peli.component.ts` entrada.service, lo inyectamos en el contructor y creamos la función que le enviara los datos del form

~~~
import { Component, OnInit } from '@angular/core';
import { EntradasService } from '../servicios/entradas.service';

@Component({
  selector: 'app-insert-peli',
  templateUrl: './insert-peli.component.html',
  styleUrls: ['./insert-peli.component.css']
})
export class InsertPeliComponent implements OnInit {

  Titulo="";
  Comentario="";
  Fecha='0000-00-00';
  constructor(private entradasService: EntradasService) { }

  ngOnInit() {
  }

   private insert(){
    this.entradasService.insertEntrada({"titulo": this.Titulo,"comentario": this.Comentario,"Fecha":this.Fecha}).subscribe(res=>{
          window.alert("Entrada Ingresada Correctamente");
      });
  }
}
~~~

- Ahora configuramos el lado de la API (nuestro Endpoint), para esto abrimos `PeliSans/server/api.js` e añadimos el siguiente fragmento de código:

~~~
router.post('/entrada',(req, res)=>{
    var query = "INSERT INTO peliculas (titulo, comentario, fecha_estreno) VALUES('"+req.body.titulo+"', '"+req.body.comentario+"', '"+req.body.Fecha+"')";
    db.none(query, req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Peliculas insertadas!'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});
~~~

- Finalmente creamos la ruta para acceder a nuestro insert, mediante el enrutador de Angular, para esto vamos a `PeliSans/src/app-routing.module.ts` y añadimos lo siguiente:

~~~
import { InsertPeliComponent} from './insert-peli/insert-peli.component';

const routes: Routes = [
  { path: '', component: FeedComponent },
  { path: 'entradas/new', component: InsertPeliComponent }
];
~~~

-Ahora Puedes probar nuestra API en `localhost:3000` y sigue desarrollando y explotando tu **CREATIVIDAD!!!!** 

# BONUS

Jugaremos con estilos y diseño de la página
* Dirígete a `PeliSans\src\assets` y crea una carpeta llamada **images**, luego descarga esta [imagen] y guárdala en **images**
* Por último añade esta serie de estilos en `PeliSans\src\styles.css`:

~~~
/* You can add global styles to this file, and also import other style files */

* { padding: 0; margin: 0; }
html, body, #fullheight {
    min-height: 100% !important;
    height: 100%;
    background: url('./assets/images/ticket.jpg');
    overflow-x: hidden;
}

p{
    color: rgb(0, 0, 0) !important
}
a, h1, h4, label{
    color: rgb(255, 255, 255) !important
}
.navbar{
    background-color: rgba(255, 115, 0, 0.632) !important;
    color: white;
}
.card-header, .card{
    background-color: rgba(255, 115, 0, 0.632) !important;
}
.card-body{
    background-color: rgb(255, 255, 255) !important;
}
.card:hover{
    -webkit-transform: scale(1.2);
    -ms-transform: scale(1.2);
    transform: scale(1.2);
    transition: 0.15s ease;
    z-index: 1000;
  }
.card:hover,.card-body:hover{
  
    background-color: rgb(245, 0, 87);
    border-color: white;
    color: white;
}

.btn{
    margin-left: 20.5%;
    background-color: rgba(218, 141, 0, 0.849) !important;
    border-color: rgba(218, 141, 0, 0.849);
}
.btn:hover{
    background-color: rgba(255, 166, 2, 0.972) !important;
    border-color: rgba(255, 167, 3, 0.849);
}
.disenno{
    background-color: rgba(218, 141, 0, 0.849);
    padding: 0.7%;
}

~~~


[info]: <https://mherman.org/blog/designing-a-restful-api-with-node-and-postgres/>
[imagen]: <https://pixabay.com/es/admisi%C3%B3n-cup%C3%B3n-admitir-carnaval-2974645/>
[localhost:3000/api/v1/entradas]: <localhost:3000/api/v1/entradas>