import { request, response } from "express";
import conn from "../database/dbConnection.js";

class companyModel {
  constructor() {}

  static async createCompany(req = request, res = response) {
    try {
      const { nit, nombre, codigo_postal, direccion } = req.body; // obtener datos del form
      const [companyFound] = await conn.query(
        "select * from companies where nit = ?",
        [nit]
      ); // verificar si existe una compañia regustrada con el nit ingresado

      if (companyFound.length > 0) {
        return res
          .status(400)
          .json({ message: `a company is already using the NIT: ${nit}` });
      } // si sí existe entonces se manda el error al front

      const user_id = req.user.user_id;

      const companyCreated = await conn.query(
        "insert into companies values(?,?,?,?,?)",
        [nit, nombre, codigo_postal, direccion, user_id]
      ); // se crea la compañia

      const updateTypeAccount = await conn.query(
        "update users set type_account = ? where user_id = ?",
        ["Company", user_id]
      ); // actualizar el usuario a tipo compañia

      return res.status(201).json({ message: "data updated succesfully" });
    } catch (error) {
      console.log(error, "=> company");
      return res.status(500).json({ message: "company could not be created" });
    }
  } // crear / añadir info adicional al usuario de tipo compañia

  static async updateCompany(req = request, res = response) {
    try {
      const { nit, nombre, codigo_postal, direccion } = req.body; // obtener datos del form
      // const [companyFound] = await conn.query(
      //   "select * from companies where nit = ?",
      //   [nit]
      // ); // verificar si existe una compañia regustrada con el nit ingresado

      // if (companyFound.length > 0) {
      //   return res
      //     .status(401)
      //     .json({ message: `a company is already using the NIT: ${nit}` });
      // }

      const {user_id} = req.user;

      const companyUpdated = await conn.query(
        "update companies set nit = ?, nombre = ?, codigo_postal = ?, direccion = ? where user_id = ?",
        [nit, nombre, codigo_postal, direccion, user_id]
      ); // actualizamos /  editar la informacion del usuario de tipo compañia

      return res
        .status(201)
        .json({ message: "info has been updated successfully" });
    } catch (error) {
      console.log(error, "=>update compnay");
      return res.status(500).json({ message: "info could not be updated" });
    }
  }
} // actualizar / editar la info adicional del usuario de tipo compañia

export default companyModel;
