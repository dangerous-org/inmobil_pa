import { Router } from "express";
import { signIn, signUp, logOut } from "../controllers/auth.controller.js";
import validateSchema from "../middleware/validate.schema.js";
import { userSchemaSignIn, userSchemaSignUp } from "../schemas/auth.schema.js";
const authRouter = Router();

authRouter.get("/");
authRouter.post("/sign-in", validateSchema(userSchemaSignIn), signIn);
authRouter.post("/sign-up", validateSchema(userSchemaSignUp), signUp);
authRouter.post("/log-out", logOut);
export default authRouter;
