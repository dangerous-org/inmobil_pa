import { Router } from "express";
import { createNaturalPerson } from "../controllers/account.controller.js";
import validateAuth from '../middleware/validate.auth.js'
import validateSchema from "../middleware/validate.schema.js";
import { companies, naturalPersonSchema } from "../schemas/account.schema.js";
const accountRouter = Router();

accountRouter.post(
  "/account/info",
  validateAuth,
  validateSchema(naturalPersonSchema),
  createNaturalPerson
);

accountRouter.put("/account/info");

export default accountRouter;
