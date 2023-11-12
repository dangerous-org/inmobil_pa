import { request, response } from "express";
import { v4 } from "uuid";
import conn from "../database/dbConnection.js";

class Catalogue {

    constructor(){
    }

    static async getCatalogues(req = request, res = response){
        try {
            const [catalogues] = await conn.query('select * from catalogue where state = ?',
            [true]); // obtiene todos los catalogos
            return res.status(200).json({
                catalogues
            });
        } catch (err) {
            console.log(err, '=> server failed');
            return res.status(500).json({
                message : 'Server failed'
            })
        }
    }

    static async getUserCatalogues(req = request, res = response){
        try {
            const {user_id} = req.user;
            const [catalogues] = await conn.query('call getUserCatalogues(?,?)',
            [user_id,1]); // obtiene todos los catalogos activos de un usuario
            return res.status(200).json({
                catalogues : catalogues[0]
            });
        } catch (err) {
            console.log(err, '=> server failed');
            return res.status(500).json({
                message : 'Server failed'
            })
        }
    }

    static async getCatalogueById(req = request, res = response){
        try {
            const {catalogue_id} = req.params;
            const [catalogue] = await conn.query('call getCatalogueById(?)',
            [catalogue_id]); //obtiene el catalogo con el id 
            if(catalogue[0].length < 1){
                return res.status(400).json({
                    message : 'This catalogue is not exist' // comprueba si lo encontro
                });
            }
            return res.status(200).json({
                catalogue : catalogue[0] 
            });
        } catch (err) {
            console.log(err, '=> server failed');
            return res.status(500).json({
                message : 'Server failed'
            })
        }
    }

    static async createCatalogue(req = request,res = response ){
        try {
            const {user_id} = req.user;
            const {name, description} = req.body;
            const catalogue_id = v4();  // Id generado
            await conn.query(`insert into catalogue(catalogue_id,name,description,user_id) values(?,?,?,?)`,
            [catalogue_id,name,description,user_id]); //insercion del catalogo en la bd
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
    static async deleteCatalogue(req = request, res = response){
        try {
            const {catalogue_id} = req.params;
            const [catalogueFound] = await conn.query (`select * from catalogue where catalogue_id = ?`,
            [catalogue_id]); 
            // verifica si hay un catalogo con ese id o si ya fue eliminado
            if(catalogueFound.length < 1 || catalogueFound[0].state == 0){ 
                return res.status(400).json({
                    message : 'This catalogue alredy has been deleted'
                });
            }
            await conn.query(`update catalogue set state = ? where catalogue_id = ?`,
            [false,catalogue_id]);  // cambia el estado del post en la base de datos
            return res.status(200).json({
                message : 'Deleted successfully'
            });
        } catch (err) {
            console.log(err, '=> server failed');
            return res.status(500).json({
                message : 'Server error'
            });
        }
    }

    static async updateCatalogue(req = request, res = response) {
        try {
            const {catalogue_id} = req.params;
            const {name,description} = req.body;
            const [catalogueFound] = await conn.query (`select * from catalogue where catalogue_id = ?`,
            [catalogue_id]); 
            // verifica si hay un catalogo con ese id o si ya fue eliminado
            if(catalogueFound.length < 1 || catalogueFound[0].state === 0){ 
                return res.status(400).json({
                    message : 'This catalogue has been deleted or is not exist'
                });
            }
            await conn.query(`update catalogue set name = ?, description = ? where catalogue_id = ?`,
            [name,description,catalogue_id]);  // cambia el estado del post en la base de datos
            return res.status(200).json({
                message : 'updated successfully'
            });
        } catch (err) {
            console.log(err, '=> server failed');
            return res.status(500).json({
                message : 'Server error'
            });
        }
    }
    static async addPostToCatalogue(req = request, res = response) {
        try {
            const {} = req.params;
        } catch (err) {
            
        }
    }
}

export default Catalogue;