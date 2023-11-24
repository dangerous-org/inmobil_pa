import { Router } from "express";
import validateSchema from "../middleware/validate.schema.js";
import profileSchema from "../schemas/profile.schema.js";
import validateAuth from "../middleware/validate.auth.js";
import { createProfile, putBanner, putBiography, putPhoto, updateProfile, getProfile } from "../controllers/profile.controller.js";

const profileRouter = Router();

profileRouter.get("/get-profile/:user_id", getProfile);

profileRouter.post('/create-profile',
validateAuth,
validateSchema(profileSchema),
createProfile
);

profileRouter.put('/update-profile',
validateAuth,
updateProfile
);

profileRouter.put('/update-photo',
validateAuth,
putPhoto);

profileRouter.put('/update-banner',
validateAuth,
putBanner);

profileRouter.put('/update-biography',
validateAuth,
putBiography);

export default profileRouter;