import { Router } from "express";
import validateSchema from "../middleware/validate.schema.js";
import profileSchema from "../schemas/profile.schema.js";
import validateAuth from "../middleware/validate.auth.js";
import { createProfile, updateProfile } from "../controllers/profile.controller.js";

const profileRouter = Router();

profileRouter.post('/create-profile',
validateSchema(profileSchema),
validateAuth,
createProfile
);

profileRouter.put('/update-profile/',
validateAuth,
updateProfile
)


export default profileRouter;