const sql = require("./db.js");

//constructor
const Tarjeta = function(tarjeta) {
    this.numero = tarjeta.numero;
    this.contrasenia = tarjeta.contrasenia;
    this.tipo = tarjeta.tipo;
    this.saldo = tarjeta.saldo;
    this.id_cliente = tarjeta.id_cliente;
}

Tarjeta.create = (newTarjeta, result) => {
    sql.query("INSERT INTO Tarjeta SET ?", newTarjeta, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    
        console.log("Tarjeta created: ", { id_tarjeta: res.insertId, ...newTarjeta });
        result(null, { id_tarjeta: res.insertId, ...newTarjeta });
    });
};

Tarjeta.findById = (id, result) => {
    //console.log("Id Propiedad: "+id);
    sql.query(`SELECT * FROM Tarjeta WHERE id_tarjeta = ${id}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    
        if (res.length) {
          console.log("Tarjeta found: ", res[0]);
          result(null, res[0]);
          return;
        }
    
        // not found Tutorial with the id
        result({ kind: "Tarjeta_not_found" }, null);
    });
};

Tarjeta.getAll = (title, result) => {
    let query = "SELECT id_tarjeta, tipo, numero FROM Tarjeta";

    if (title) {
        query += ` WHERE id_cliente LIKE '%${title}%'`;
    }

    sql.query(query, (err, res) => {
        if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
        }

        console.log("propiedades: ", res);
        result(null, res);
    });
};

Tarjeta.updateById = (id, tarjeta, result) => {
    //console.log("Id Propiedad: "+id);
    sql.query(
        "UPDATE Tarjeta SET numero = ?, contrasenia = ?, tipo = ?, saldo = ?, id_cliente = ? WHERE id_tarjeta = ?",
        [tarjeta.numero, tarjeta.contrasenia, tarjeta.tipo, tarjeta.saldo, tarjeta.id_cliente, id],
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }
    
          if (res.affectedRows == 0) {
            // not found propiedad with the id
            result({ kind: "not_found" }, null);
            return;
          }
    
          console.log("Tarjeta updated: ", { id_tarjeta: id, ...tarjeta });
          result(null, { id_tarjeta: id, ...tarjeta });
        }
    );
};

Tarjeta.remove = (id, result) => {
  sql.query("DELETE FROM Tarjeta WHERE id_tarjeta = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Deleted card with id: ", id);
    result(null, res);
  });
};

Tarjeta.removeAll = result => {
    sql.query("DELETE FROM propiedad", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} propiedad`);
      result(null, res);
    });
};

module.exports = Tarjeta;