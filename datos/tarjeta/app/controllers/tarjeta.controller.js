const req = require("express/lib/request");
const res = require("express/lib/response");
const Tarjeta = require("../models/tarjeta.model.js");

//create & save new property
exports.create = (req, res) => {
    if(!req.body){
        res.status(400).send({
            message: "El contenido no debe estar vacio!"
        });
    }

    //create property
    const tarjeta = new Tarjeta({
        numero: req.body.numero,
        contrasenia: req.body.contrasenia,
        tipo: req.body.tipo,
        saldo: req.body.saldo,
        id_cliente: req.body.id_cliente
    });
    
    //save card to DB
    Tarjeta.create(tarjeta, (err, data) => {
        if(err)
            res.status(500).send({
                message: 
                    err.message || "Error en la creacion de tarjeta"
            });
        else res.send({ message: `Card was created successfully!` });
    });
};

//return all cards from the DB (with condition)
exports.findAll = (req, res) => {
    const title = req.query.title;

    Tarjeta.getAll(title, (err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Error mientras se despliegan las propiedades!"
            });
        else res.send(data);
    });
};

//return a card by the id
exports.findOne = (req, res) => {
    Tarjeta.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Card with id ${req.params.id}.`
              });
            } else {
              res.status(500).send({
                message: "Error retrieving Card with id " + req.params.id
              });
            }
          } else res.send(data);
    });
};

// Update a card identified by the id (not used)
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    console.log(req.body);
  
    Tarjeta.updateById(
      req.params.id,
      new Tarjeta(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Property Update with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Property with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
  };
  
  // Delete a Card with the specified id in the request
  exports.delete = (req, res) => {
    Tarjeta.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Card with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Card with id " + req.params.id
          });
        }
      } else res.send({ message: `Card was deleted successfully!` });
    });
  };