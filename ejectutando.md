
# Run
Para ejecutar corre en consola 
~~~
npm install
~~~

* Con los modulos de node.js instalados, pobla una base de datos postgreSQL con datos de peliculas, la estructura de la tablas deberian ser así:
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

**Recuerda que debes modificar los datos de config.js acordes a tu base de datos**
