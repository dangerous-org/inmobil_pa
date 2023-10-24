import { request, response } from "express";
import conn from "../database/dbConnection.js";
class AcoountModel {
  constructor() {}
  static async natural_persona(req = request, res = response) {
    try {
      const {
        dni,
        nombre,
        apellido_1,
        apellido_2,
        edad,
        pais,
        direccion,
        ciudad,
        departamento,
      } = req.body; // obtener datos del formulario

      const [personFound] = await conn.query(
        "select * from natural_person where dni = ?",
        [dni]
      ); //consulta para verificar si ya existe una persona con el dni ingresado

      if (personFound.length > 0) {
        return res
          .status(400)
          .json({ message: `a person is already using the DNI: ${dni}` });
      } // si existe un usuario ya registrado con el dni, se envía error al front

      const personCreated = await conn.query(
        "insert into natural_person values(?,?,?,?,?,?,?,?,?,?)",
        [
          dni,
          nombre,
          apellido_1,
          apellido_2,
          edad,
          pais,
          direccion,
          ciudad,
          departamento,
          user_id,
        ]
      ); // sino existe el usuario se agrega la informacion

      return res.status(201).json({ message: "data updated succesfully" });
    } catch (error) {
      console.log(error, "=> natural person");
      return res
        .status(500)
        .json({ message: "500 || user could not be created" });
    }
  } // crear / añadir info adicional al usuario de tipo persona
}

export default AcoountModel;
