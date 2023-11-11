import { request, response } from "express";
import { v4 } from "uuid";
import conn from "../database/dbConnection.js";

class Catalogue {

    constructor(){

    }

    static async createCatalogue(req = request,res = response ){
        try {
            const {name, description} = req.body;
            const catalogue_id = v4();  // Id generado

            await conn.query(`insert into catalogues(catalogue_id,name,description) values(?,?,?)`,
            [catalogue_id,name,description]); //insercion del catalogo en la bd

            return res.status(201).json({
                message : 'Catalogue has been created'
            });

        } catch (err) {
            console.log(err, '=> server failed');
            return res.status(500).json({
                message : `Server error`
            });
        }
    }
}

export default Catalogue;