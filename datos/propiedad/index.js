const express = require('express');
const mysql = require('mysql');
const nodemailer = require("nodemailer");
const app = express();
const dateShortcode = require('date-shortcode')

const fileUpload = require('express-fileupload')
var cors = require('cors')
var morgan=require('morgan')
var bodyParser = require('body-parser');
const req = require('express/lib/request');
const res = require('express/lib/response');


app.use(express.static('files'));
//app.use(express.json());
app.use(fileUpload())
app.use(cors())

app.use(bodyParser.json({limit: "90mb"}));
app.use(bodyParser.urlencoded({limit: "90mb", extended: true, parameterLimit:50000}));

app.use(morgan("dev"));

const connection = mysql.createPool({
	connectionLimit: 10,
	host: process.env.MYSQL_HOST || 'localhost',
	user: process.env.MYSQL_USER || 'root',
	password: process.env.MYSQL_PASSWORD || 'rodolfo240891',
	database: process.env.MYSQL_DATABASE || 'clientes-api'
});
  
//get all services
  app.get("/api/servicios/",async (req, res)=> {
	//let id=req.params.id;
    const insert = connection.query('Select * from Servicio',function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });

  //get all propertires
  app.get("/api/property/",async (req, res)=> {
	//let id=req.params.id;
    const insert = connection.query('Select * from Propiedad',function (err, rows) {
        if (err) throw err;
        res.json(rows);
      });
  });
  
  //get properties by ID
  app.get("/api/propiedad/:id",async (req, res)=> {
    let id=req.params.id;
      const insert = connection.query('Select * from Propiedad where id_propiedad ='+id,function (err, rows) {
          if (err) throw err;
          res.json(rows);
        });
    });

  //get properties by Anfritrion
  app.get("/api/propiedad/anfitrion/:id",async (req, res)=> {
    let id=req.params.id;
      const insert = connection.query('Select * from Propiedad where id_anfitrion ='+id,function (err, rows) {
          if (err) throw err;
          res.json(rows);
        });
    });

  //get properties by ponderacion desc
  app.get("/api/propiedad/",async (req, res)=> {
      const insert = connection.query('Select * from Propiedad order by ponderacion desc',function (err, rows) {
          if (err) throw err;
          res.json(rows);
        });
    });

  //add property
  app.post("/api/propiedad/",async (req, res)=> {
      let foto = req.body.photo;
      let valor= req.body.value;
      let descripcion= req.body.description;
      let capacidad= req.body.capacity;
      let noHabitacion= req.body.no_rooms;
      let noCamas= req.body.no_beds;
      let noBanios= req.body.no_bathrooms;
      let id_anfitrion= req.body.id_host;      

      const json = req.body.services;
      
	 if(descripcion){
      let consulta='Insert into Propiedad(foto,valor,descripcion,capacidad,no_hab,no_camas,no_banios,id_anfitrion) values('
      connection.query(consulta+'\''+foto+'\','+valor+',\''+descripcion+'\','+capacidad+','+noHabitacion+','+noCamas+','+noBanios+','+id_anfitrion+')',function (err, rows) {
        if (err) throw err;	        
      res.json({ message: `Property was created successfully!` });     
      });
      
      insertDetalle(json);
   }else{
      let consulta='Insert into Propiedad(foto,valor,no_hab,no_camas,no_banios,id_anfitrion) values('
      connection.query(consulta+'\''+foto+'\','+valor+','+noHabitacion+','+noCamas+','+noBanios+','+id_anfitrion+')',function (err, rows) {
        if (err) throw err;	
      res.json({ message: `Property was created successfully!` });     
      });
      insertDetalle(json);
   }

   
  });

  //insert detalle de servicios propiedades
  function insertDetalle(services){
      
    const select = connection.query('SELECT MAX(id_propiedad) as maximo FROM Propiedad;',function (err, rows) {
      if (err) throw err;
      const id = rows[0].maximo;
      //console.log(id);    
    
      for (let i in services ){
        //console.log("ID: "+id);
        //console.log(services[i]);
        let consulta='Insert into Propiedad_Servicios(id_propiedad, id_servicio) values('
        const insert = connection.query(consulta+id+','+services[i]+')',function (err, rows) {
          if (err) throw err;	
        else console.log("Detalle Ingresado");
        });
      }

    });
  }

  //update property
  app.put("/api/propiedad/:id",async (req, res)=> {
    let id=req.params.id;

    let foto = req.body.photo;
    let valor= req.body.value;
    let descripcion= req.body.description;
    let capacidad= req.body.capacity;
    let noHabitacion= req.body.no_rooms;
    let noCamas= req.body.no_beds;
    let noBanios= req.body.no_bathrooms;
    let id_anfitrion= req.body.id_host;

    const json = req.body.services;

    const insert = connection.query('Update Propiedad set foto=\''+foto+'\', valor='+valor+', descripcion=\''+descripcion+'\', capacidad='+capacidad+', no_hab='+noHabitacion+', no_camas='+noCamas+', no_banios='+noBanios+', id_anfitrion='+id_anfitrion+' where (id_propiedad='+id+')',function (err, rows) {
      if (err) throw err;
      res.json({ message: `Property was Updated successfully!` });
    });
    updateDetalle(json, id);
    //console.log(insert);
 
});

//insert detalle de servicios propiedades
function updateDetalle(services, id){
  console.log("Servicios: "+services + " " + id);
  const select = connection.query('DELETE FROM Propiedad_Servicios WHERE id_propiedad='+id+' and id_servicio NOT IN ('+services+')',function (err, rows) {
    if (err) {throw err}
    else{
      insertDetalle2(services,id);
    }
  });    
}
  //insert detalle de servicios propiedades
  function insertDetalle2(services, id){
       
      for (let i in services ){
        //console.log("ID: "+id);
        //console.log(services[i]);        
        const con2 = connection.query('Select * from Propiedad_Servicios where id_propiedad='+id+' and id_servicio='+services[i]+')',function (err, rows) {
          if (!rows){
            console.log("Servicio encontrado");
          }else {
            let consulta='Insert into Propiedad_Servicios(id_propiedad, id_servicio) values('
            const insert = connection.query(consulta+id+','+services[i]+')',function (err, rows) {
              if (err) throw err;	
            else console.log("Detalle Update Ingresado");
            });
          }
        });
        
        //let consulta='Insert into propiedad_servicios(id_propiedad, id_servicio) values('
        //const insert = connection.query(consulta+id+','+services[i]+')',function (err, rows) {
        //  if (err) throw err;	
        //else console.log("Detalle Ingresado");
        //});
      }
  }

//delete property
  app.delete("/api/propiedad/:id",async (req, res)=> {
    let id=req.params.id;
    const insert = connection.query('Delete from Propiedad where id_propiedad='+id,function (err, rows) {
        if (err) throw err;
        res.json({ message: `Property was Deleted successfully!` });
      });
  });

app.listen(3300, () => console.log('listining on port 3300'));
