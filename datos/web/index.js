const express = require('express');
const mysql = require('mysql');
const app = express();


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
	password: process.env.MYSQL_PASSWORD || 'password',
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
	let pass= body.pass;
	let correo= body.correo;
    const consulta = connection.query('Select * from Cliente where(correo=\''+correo+'\' and contrasenia=\''+pass+'\' )',function (err, rows) {
        if (err) throw err;
        let bandera=false
		if(rows.length==1){
			bandera=true
			res.json({estado:bandera,Usuario:{id_cliente:rows[0].id_cliente,nombre:rows[0].nombre,apellido:rows[0].apellido,correo:rows[0].correo,celular:rows[0].celular,fecha_nac:rows[0].fecha_nacm,foto:rows[0].foto,tipox:"cliente"}});
		}else{

			const consulta = connection.query('Select * from Anfitrion where(correo=\''+correo+'\' and contrasenia=\''+pass+'\' )',function (err, rows) {
				if (err) throw err;
				let bandera=false
				if(rows.length==1){
					bandera=true
					res.json({id_anfitrion:rows[0].id_anfitrion,nombre:rows[0].nombre,apellido:rows[0].apellido,tipo:rows[0].tipo,empresa:rows[0].empresa,dpi:rows[0].dpi,correo:rows[0].correo,foto:rows[0].foto,direccion:rows[0].direccion,estado:rows[0].estado,n_instancias:rows[0].n_instancias,valoracion:rows[0].valoracion});
				}else{
							
					res.json({tipox:"null"});
				}
				
			});
			//res.json({estado:bandera,Usuario:""});
		}
		
		//res.json(rows);
      });
  });

app.listen(5000, () => console.log('listining on port 5000'));
