import { Router } from "express";
import  {signIn, signUp} from "../controllers/user.controller.js";
import validateSchema from "../middleware/validate.schema.js";
import userSchema from "../schemas/user.schema.js";
import validateAuth from "../middleware/validate.auth.js";
const authRouter = Router();

authRouter.get('/',);
authRouter.post('/sign-in',signIn);
authRouter.post('/sign-up',validateSchema(userSchema),signUp);





export default authRouter;