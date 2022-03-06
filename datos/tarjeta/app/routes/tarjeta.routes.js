module.exports = app => {
    const tarjeta = require("../controllers/tarjeta.controller.js");

    var router = require("express").Router();

    //create new propiedad
    router.post("/", tarjeta.create);

    //Return all properties
    router.get("/", tarjeta.findAll);

    //Return a property with an id
    router.get("/:id", tarjeta.findOne);

    //Update a property with an id
    router.put("/:id", tarjeta.update);

    //Delete a property with an id
    router.delete("/:id", tarjeta.delete);

    app.use('/api/cards', router);
};