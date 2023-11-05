import { Router } from "express";
import validateAuth from "../middleware/validate.auth.js";
import validateShema from "../middleware/validate.schema.js";
import estateSchema from "../schemas/estate.schema.js";
import { createEstate } from "../controllers/estate.controller.js";
const estateRoutes = Router();

estateRoutes.post(
  "/create-estate/:post_id",
  validateAuth,
  validateShema(estateSchema),
  createEstate
);

export default estateRoutes;
