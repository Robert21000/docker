const express = require('express')
const fileUpload = require('express-fileupload')
var cors = require('cors')
const mysql = require('mysql');

var morgan=require('morgan')

//const uuidv1 = require('uuid/v1');


var bodyParser = require('body-parser')

const app = express()


app.use(express.static('files'));
//app.use(bodyParser());
app.use(fileUpload())
app.use(cors())

app.use(bodyParser.json({limit: "90mb"}));
app.use(bodyParser.urlencoded({limit: "90mb", extended: true, parameterLimit:50000}));

app.use(morgan("dev"));

const connection = mysql.createConnection({
    host: "54.227.104.17",
    port:"33060",
    user: "root",
    password: "secret",
    database: "bd_g8"
  });

  


  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });


  app.get("/api/clientes",async (req, res)=> {

    const insert = connection.query('Select * from Cliente',function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });






app.listen(3000,"0.0.0.0",() => console.log('Corriendo en el puerto 3000..'))
