import { Router } from "express";
import { signIn, signUp, logOut, followUser, unfollow } from "../controllers/auth.controller.js";
import validateSchema from "../middleware/validate.schema.js";
import { userSchemaSignIn, userSchemaSignUp } from "../schemas/auth.schema.js";
import validateAuth from "../middleware/validate.auth.js";
const authRouter = Router();

authRouter.get("/");
authRouter.post("/sign-in", validateSchema(userSchemaSignIn), signIn);
authRouter.post("/sign-up", validateSchema(userSchemaSignUp), signUp);
authRouter.post("/follow/:followed_id",validateAuth,followUser);
authRouter.delete("/unfollow/:followed_id",validateAuth,unfollow);
authRouter.post("/log-out", logOut);
export default authRouter;
