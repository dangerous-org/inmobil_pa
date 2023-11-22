import { request, response } from "express";
import Catalogue from "../models/catalogue.model.js" 

 
export const createCatalogue = async (req, res) => {
    await Catalogue.createCatalogue(req, res);
}

export const deleteCatalogue = async(req, res) => {
    await Catalogue.deleteCatalogue(req, res);
}

export const updateCatalogue = async(req, res) => {
    await Catalogue.updateCatalogue(req, res);
}

export const getCatalogues = async(req, res) => {
    await Catalogue.getCatalogues(req, res);
}

export const getUserCatalogues = async(req, res) => {
    await Catalogue.getUserCatalogues(req, res);
}

export const getCatalogueById = async(req, res) => {
    await Catalogue.getCatalogueById(req, res);
}

export const addPostToCatalogue = async(req, res) => {
    await Catalogue.addPostToCatalogue(req, res);
}

export const getPostsInCatalogue = async(req, res) => {
    await Catalogue.getPostsInCatalogue(req,res);
}