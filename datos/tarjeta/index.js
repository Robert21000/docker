const express = require('express');
const mysql = require('mysql');
const nodemailer = require("nodemailer");
const app = express();
const dateShortcode = require('date-shortcode')

const fileUpload = require('express-fileupload')
var cors = require('cors')
var morgan=require('morgan')
var bodyParser = require('body-parser')


app.use(express.static('files'));
//app.use(bodyParser());
app.use(fileUpload())
app.use(cors())

app.use(bodyParser.json({limit: "90mb"}));
app.use(bodyParser.urlencoded({limit: "90mb", extended: true, parameterLimit:50000}));

app.use(morgan("dev"));




const connection = mysql.createPool({
	connectionLimit: 10,
	host: process.env.MYSQL_HOST || 'localhost',
	user: process.env.MYSQL_USER || 'root',
	password: process.env.MYSQL_PASSWORD || '1234',
	database: process.env.MYSQL_DATABASE || 'test'
});


  app.get("/api/cards/usuario/:id",async (req, res)=> {
	let id=req.params.id;
    const insert = connection.query('Select * from Tarjeta where (id_cliente='+id+')',function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });

  app.post("/api/cards/",async (req, res)=> {
		let numero= req.body.numero;
        let contrasenia= req.body.contrasenia;
        let tipo= req.body.tipo;
        let saldo= req.body.saldo;
        let id_cliente= req.body.id_cliente;

	 let consulta='Insert into Tarjeta(numero,contrasenia,tipo,saldo,id_cliente) values('
	 connection.query(consulta+''+numero+',\''+contrasenia+'\',\''+tipo+'\','+saldo+','+id_cliente+')',function (err, rows) {
        if (err) throw err;	
		res.json(rows);
		
      });
  });
  
  app.delete("/api/cards/usuario/",async (req, res)=> {
    let id_tarjeta=req.body.id_tarjeta;
    let id_cliente=req.body.id_cliente
    const insert = connection.query('Delete from Tarjeta where id_tarjeta='+id_tarjeta+' and id_cliente = '+id_cliente,function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });
  


app.listen(3000, () => console.log('listining on port 3000'));
