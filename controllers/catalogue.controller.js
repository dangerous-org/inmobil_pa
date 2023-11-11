import { request, response } from "express";
import Catalogue from "../models/catalogue.model.js" 

 
const createCatalogue = async (req, res) => {
    await Catalogue.createCatalogue(req,res);
}

export default createCatalogue;