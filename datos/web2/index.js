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


app.get("/api/reservacion/propiedad/:id",async (req, res)=> {
	let id=req.params.id;
    const insert = connection.query('Select * from Reservacion as r join Cliente as c on r.id_cliente=c.id_cliente join Propiedad as p on r.id_propiedad=p.id_propiedad  where (r.id_propiedad='+id+')',function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });


  app.get("/api/propiedades/anfitrion/:id",async (req, res)=> {
	let id=req.params.id;
    const insert = connection.query('Select * from Propiedad where (id_anfitrion='+id+')',function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });


  app.get("/api/propiedad/:id",async (req, res)=> {
	let id=req.params.id;
    const insert = connection.query('Select * from Propiedad where (id_propiedad='+id+')',function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });


  app.post("/api/reservacion/estado/",async (req, res)=> {
	let estado=req.body.estado;
	let id_reservacion=req.body.id_reservacion;
    let id_cliente=req.body.id_cliente;
	const insert = connection.query('Update Reservacion set estado=\''+estado+'\' where(id_reservacion='+id_reservacion+')',function (err, rows) {
        if (err) throw err;
		connection.query('Select correo from Cliente where(id_cliente='+id_cliente+')',function (err, result){ 
			if (err) throw err;
		//console.log(result[0].correo)
		enviarEmail(result[0].correo,"rechazado")	
		res.json(result);
      });
      });
  });
  



app.post("/api/reservacion",async (req, res)=> {

	
	let body=req.body;
	let fecha_ini=body.fecha_ini;
	let fecha_fin=body.fecha_fin;
	let tipo=body.tipo; 
	let estado=body.estado;
	let id_cliente=body.id_cliente;
	let id_propiedad=body.id_propiedad;
		
	 connection.query('Select * from Reservacion where(id_propiedad='+id_propiedad+')',function(err,rows){ 
	if (err) throw err;
        let bandera=false
		if(rows.length>=1){
			bandera=true		
		}
		if(bandera){
			let disponible=true;
			for(let i=0;i<rows.length;i++){

				if(EstaDisonible(fecha_ini,fecha_fin,rows[i].fecha_ini,rows[i].fecha_fin)){
						
				}else{
						disponible=false;
				}
			}

			if(disponible){
					
			let consulta='Insert into Reservacion(fecha_ini,fecha_fin,tipo,estado,id_cliente,id_propiedad) values ('
			connection.query(consulta+"\'"+fecha_ini+"\',\'"+fecha_fin+"\',\'"+tipo+"\',\'"+estado+"\',"+id_cliente+","+id_propiedad+")",function(err,result){ 
				if (err) throw err;	
				res.json({result:result})	
			});


			}else{
				res.status(404).send('Not found');
			}
			
		}else{

			
			//res.json({res:"se puede insertar"});
			let consulta='Insert into Reservacion(fecha_ini,fecha_fin,tipo,estado,id_cliente,id_propiedad) values ('
			connection.query(consulta+"\'"+fecha_ini+"\',\'"+fecha_fin+"\',\'"+tipo+"\',\'"+estado+"\',"+id_cliente+","+id_propiedad+")",function(err,result){ 
				if (err) throw err;	
				res.json({result:result})	
			});
		}
  });

});


function EstaDisonible(ini,fin,ini_actual,fin_actual){
	let disponible=false;
	let iactual=formatDate(ini_actual)
	let factual=formatDate(fin_actual)

	if(ini<fin){
		if(ini<iactual &&fin<iactual){
	
			disponible=true;
		}else if(ini>iactual&&ini>factual){

			disponible=true;
		}
	}else{
		disponible=false;
		
	}

	return disponible;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
 


function enviarEmail(correo,estado){
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		  user: 'mario69series24@gmail.com',
		  pass: 'bssgwhutvnziprbd'
		}
	  });
	  
	  var mailOptions = {
		from: 'mario69series24@gmail.com',
		to: correo,
		subject: '[Reservacion]',
		text: 'Su reservacion fue: '+estado
	  };
	  
	  transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log('Email sent: ' + info.response);
		}
	  });

}




app.listen(5500, () => console.log('listining on port 5500'));
