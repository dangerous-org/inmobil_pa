import personModel from "../models/person.model.js";
import companyModel from "../models/company.model.js";
import authModel from "../models/auth.model.js";

export const createNaturalPerson = async (req, res) => {
  await personModel.createPerson(req, res);
}; // crear persona

export const updateNaturalPerson = async (req, res) => {
  await personModel.updatePersona(req, res);
}; // actualizar persona

export const createCompany = async (req, res) => {
  await companyModel.createCompany(req, res);
}; // crear compañia

export const updateCompany = async (req, res) => {
  await companyModel.updateCompany(req, res);
}; // actualizar compañia

export const updateUser = async (req, res)=>{
  await authModel.updateUser(req, res);
}; // actualizar usuario