const express = require('express');
const mysql = require('mysql');
const nodemailer = require("nodemailer");
const app = express();
const dateShortcode = require('date-shortcode')

const fileUpload = require('express-fileupload')
var cors = require('cors')
var morgan=require('morgan')
var bodyParser = require('body-parser')

var AWS = require('aws-sdk');

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


const s3 = new AWS.S3({
	accessKeyId:'AKIA2TKFJE5IAKGCCUMT',
	secretAccessKey:'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',
	region:'us-east-1'

});

app.post('/api/upload',async (req,res) => {
    let file = req.files['file']
      
        const params ={
            Bucket:'s3aydg8',
            Key:"usuario/"+file.name,
            Body:file.data,
            ContentType:"image"
        }
        

        const putObjectpromise= s3.upload(params).promise();
        putObjectpromise.then((result)=>{
            console.log(result.Location)
            res.json({url:result.Location})    
        }).catch(error=>{
            console.log(error,"error_promise");
            res.json({dato:"result.Location"})
        })
      
})



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

						connection.query(consulta+"(\'"+nombre+"\',\'"+apellido+"\',\'"+tipo+"\',\'"+empresa+"\',\'"+dpi+"\',\'"+correo+"\',\'"+pass+"\',\'"+foto+"\',\'"+direccion+"\',\'"+estado+"\',"+instancias+","+valoracion+")",function (err, result) {
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


  app.get("/api/cliente/:id",async (req, res)=> {
	let id=req.params.id;
    const insert = connection.query('Select * from Cliente where (id_cliente='+id+')',function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });


  app.get("/api/cliente/reservacion/:id",async (req, res)=> {
	let id=req.params.id;
    const insert = connection.query('Select * from Reservacion as r join Cliente as c on r.id_cliente=c.id_cliente join Propiedad as p on r.id_propiedad=p.id_propiedad  where (r.id_cliente='+id+')',function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });





app.listen(5000, () => console.log('listining on port 5000'));
