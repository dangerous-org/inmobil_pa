import { Router } from "express";
import validateAuth from "../middleware/validate.auth.js"
import validateSchema from "../middleware/validate.schema.js";
import { catalogueSchema } from "../schemas/catalogue.schema.js";
import createCatalogue from "../controllers/catalogue.controller.js";

const catalogueRouter = Router();

catalogueRouter.post('/create-catalogue',
    validateAuth,
    validateSchema(catalogueSchema),
    createCatalogue
)

export default catalogueRouter;
