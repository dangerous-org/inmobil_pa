import { Router } from "express";
import validateAuth from "../middleware/validate.auth.js"
import validateSchema from "../middleware/validate.schema.js";
import { catalogueSchema } from "../schemas/catalogue.schema.js";
import {createCatalogue, deleteCatalogue, getCatalogues, getUserCatalogues, updateCatalogue, getCatalogueById} from "../controllers/catalogue.controller.js";

const catalogueRouter = Router();

catalogueRouter.get('/get-catalogues',
    getCatalogues
);

catalogueRouter.get('/user-catalogues',
    validateAuth,
    getUserCatalogues
);

catalogueRouter.get('/get-catalogues/:catalogue_id',
    validateAuth,
    getCatalogueById
);


catalogueRouter.post('/create-catalogue',
    validateAuth,
    validateSchema(catalogueSchema),
    createCatalogue
);

catalogueRouter.delete('/delete-catalogue/:catalogue_id',
    validateAuth,
    deleteCatalogue,
);

catalogueRouter.put('/update-catalogue/:catalogue_id',
    validateAuth,
    validateSchema(catalogueSchema),
    updateCatalogue
);

export default catalogueRouter;
