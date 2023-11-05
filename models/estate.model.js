import { request, response } from "express";
import { v4 } from "uuid";
import conn from "../database/dbConnection.js";
class estateModel {
  constructor() {}

  static async createEstate(req = request, res = response) {
    try {
      const { post_id } = req.params; // recibir el post id desde los params de la url
      const estate_id = v4(); // crear un UUID

      const {
        type,
        area,
        built_area,
        built_at,
        stratum,
        n_bathrooms,
        n_rooms,
        zone_type,
        additional_desc,
      } = req.body; // recibiendo los datos del form

      const query = "insert into estate values (?,?,?,?,?,?,?,?,?,?,?)";
      const [estateCreated] = await conn.query(query, [
        estate_id,
        type,
        area,
        built_area,
        built_at,
        stratum,
        n_bathrooms,
        n_rooms,
        zone_type,
        additional_desc,
        post_id,
      ]); // creado el estate

      return res.status(201).json({ message: "Saved successfully" });
    } catch (error) {
      console.log(error, "=> error estate");
      return res.status(500).json({ message: "Estate could not be created" });
    }
  }
}

export default estateModel;
