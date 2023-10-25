import { Router } from "express";
import {
  createNaturalPerson,
  updateNaturalPerson,
  createCompany,
  updateCompany,
  updateUser,
} from "../controllers/account.controller.js";
import validateAuth from "../middleware/validate.auth.js";
import validateSchema from "../middleware/validate.schema.js";
import naturalPersonSchema from "../schemas/person.schema.js";
import companiesSchema from "../schemas/conpany.schema.js";
import { userSchemaSignUp } from "../schemas/auth.schema.js";
const accountRouter = Router();

accountRouter.post(
  "/account/person",
  validateAuth,
  validateSchema(naturalPersonSchema),
  createNaturalPerson
); // crear persona

accountRouter.put(
  "/account/person",
  validateAuth,
  validateSchema(naturalPersonSchema),
  updateNaturalPerson
); // actualizar persona

accountRouter.post(
  "/account/company",
  validateAuth,
  validateSchema(companiesSchema),
  createCompany
); // crear compañia

accountRouter.put(
  "/account/company",
  validateAuth,
  validateSchema(companiesSchema),
  updateCompany
); // actualizar compañia

accountRouter.put(
  "/account/user",
  validateAuth,
  validateSchema(userSchemaSignUp),
  updateUser
); // actualizar usuario

export default accountRouter;
