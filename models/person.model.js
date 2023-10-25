import { request, response } from "express";
import conn from "../database/dbConnection.js";
class personModel {
  constructor() {}
  static async createPerson(req = request, res = response) {
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

      const user_id = req.user.user_id;
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
      ); // se crea la persona

      const updateTypeAccount = await conn.query(
        "update users set type_account = ? where user_id = ?",
        ["Natural Person", user_id]
      ); // actualizar el usuario a tipo compañia

      return res.status(201).json({ message: "data updated succesfully" });
    } catch (error) {
      console.log(error, "=> natural person");
      return res
        .status(500)
        .json({ message: "500 || user could not be created" });
    }
  } // crear / añadir info adicional al usuario de tipo persona

  static async updatePersona(req = request, res = response) {
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
      } = req.body; // obtener datos del form

      const user_id = req.user.user_id;
      console.log(user_id);
      const query =
        "update natural_person set dni = ?, nombre = ?, apellido_1 = ?, apellido_2 = ?, edad = ?, pais = ?, direccion = ?, ciudad = ?, departamento = ? where user_id = ?";

      const personUpdated = await conn.query(query, [
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
      ]); // actualizamos /  editar la informacion del usuario de tipo compañia

      return res
        .status(201)
        .json({ message: "info has been updated successfully" });
    } catch (error) {
      console.log(error, "=> update persona");
      return res.status(500).json({ message: "info could not be updated" });
    }
  } // actualizar / editar la info adicional del usuario de tipo persona
}

export default personModel;
