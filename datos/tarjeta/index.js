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



  app.get("/api/propiedad/:id",async (req, res)=> {
	let id=req.params.id;
    const insert = connection.query('Select * from Propiedad where (id_propiedad='+id+')',function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });



  app.post("/api/cards/",async (req, res)=> {

		const tarjeta = new Tarjeta({
				numero: req.body.numero,
				contrasenia: req.body.contrasenia,
				tipo: req.body.tipo,
				saldo: req.body.saldo,
				id_cliente: req.body.id_cliente
    	});
		const insert = connection.query('INSERT INTO Tarjeta SET ?")',tarjeta,function (err, rows) {
        if (err) throw err;
		
		res.json(rows);
      });
  });


app.listen(4000, () => console.log('listining on port 4000'));
