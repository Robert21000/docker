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

app.get('/', (req, res) => {
	connection.query('SELECT * FROM Cliente' , (err, rows) => {
		if(err){
			res.json({
				success: false,
				err
				});
		}
		else{
			res.json({
				success: true,
				rows
				});
		}
	});
});

app.get("/api/clientes",async (req, res)=> {

    const insert = connection.query('Select * from Cliente',function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });


  app.post("/api/login",async (req, res)=> {
	let body=req.body;
	let pass= body.password;
	let correo= body.email;

	 connection.query('Select * from Cliente where(correo=\''+correo+'\' and contrasenia=\''+pass+'\' )',function(err,rows){ 
	if (err) throw err;
        let bandera=false
		if(rows.length==1){
			bandera=true		
		}
		if(bandera){
		res.json({id_cliente:rows[0].id_cliente,nombre:rows[0].nombre,apellido:rows[0].apellido,correo:rows[0].correo,celular:rows[0].celular,fecha_nac:rows[0].fecha_nacm,foto:rows[0].foto,tipox:"cliente"});	
		}else{

				connection.query('Select * from Anfitrion where(correo=\''+correo+'\' and contrasenia=\''+pass+'\' )',function (err, rows) {
				if (err) throw err;
				let bandera2=false
				
				if(rows.length==1){
					bandera2=true
				}
				if(bandera2){
					res.json({id_anfitrion:rows[0].id_anfitrion,nombre:rows[0].nombre,apellido:rows[0].apellido,tipo:rows[0].tipo,empresa:rows[0].empresa,dpi:rows[0].dpi,correo:rows[0].correo,foto:rows[0].foto,direccion:rows[0].direccion,estado:rows[0].estado,n_instancias:rows[0].n_instancias,valoracion:rows[0].valoracion,tipox:"anfitrion"});
				}
				else{
							
					
					res.status(404).send('Not found');
				}
				
			});
			//res.json({estado:bandera,Usuario:""});
		}
	});
  });




  app.post("/api/register",async (req, res)=> {
	let body=req.body;
	let nombre=req.body.nombre;
	let apellido=req.body.apellido;
	let correo= body.correo;
	let pass= body.contrasenia;
	let celular=body.celular;
	let fecha=body.fecha_nac;
	let foto=body.foto;
	let tipox=body.tipox;

	let empresa=body.empresa;
	let dpi=body.dpi;
	let tipo=body.tipo;
	let direccion=body.direccion;
	let estado=body.estado;
	let instancias=body.n_instancias;
	let valoracion=body.valoracion;


	 connection.query('Select * from Cliente where(correo=\''+correo+'\')',function(err,rows){ 
	if (err) throw err;
        let bandera=false
		if(rows.length==1){
			bandera=true		
		}
		if(bandera){
			res.status(404).send('Not found');
		}else{
			connection.query('Select * from Anfitrion where(correo=\''+correo+'\' )',function (err, rows) {
				if (err) throw err;
				let bandera2=false
				
				if(rows.length==1){
					bandera2=true
				}
				if(bandera2){
					res.status(404).send('Not found');
				}
				else{
						/*					
					 	res.json({result:rows})
						 */
					/**** */
					
					if(tipox=="cliente"){
						let consulta="insert into Cliente(nombre, apellido,correo,contrasenia,celular,fecha_nac,foto) values "

						connection.query(consulta+"(\'"+nombre+"\',\'"+apellido+"\',\'"+correo+"\',\'"+pass+"\',\'"+celular+"\',\'"+fecha+"\',\'"+foto+"\')",function (err, result) {
						if (err) throw err;
						res.json({result:result});

						});	

					}else if(tipox=="anfitrion"){
						let consulta='insert into Anfitrion(nombre,apellido,tipo,empresa,dpi,correo,contrasenia,foto,direccion,estado,n_instancias,valoracion) values '

						connection.query(consulta+"(\'"+nombre+"\',\'"+apellido+"\',\'"+tipo+"\',\'"+empresa+"\',"+dpi+",\'"+correo+"\',\'"+pass+"\',\'"+foto+"\',\'"+direccion+"\',\'"+estado+"\',"+instancias+","+valoracion+")",function (err, result) {
							if (err) throw err;
							res.json({result:result});	
						});		

					}else{

						res.json({error:"tipo incorrecto no debio entrar aqui"});
					}

					/**** */	
				} 
			});	
		} 
  });
});


app.get("/api/reservacion/propiedad/:id",async (req, res)=> {
	let id=req.params.id;
    const insert = connection.query('Select * from Reservacion where (id_propiedad='+id+')',function (err, rows) {
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



  app.get("/api/cliente/:id",async (req, res)=> {
	let id=req.params.id;
    const insert = connection.query('Select * from Cliente where (id_cliente='+id+')',function (err, rows) {
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


  app.get("/api/cliente/reservacion/:id",async (req, res)=> {
	let id=req.params.id;
    const insert = connection.query('Select * from Reservacion where (id_cliente='+id+')',function (err, rows) {
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




app.listen(5000, () => console.log('listining on port 5000'));
