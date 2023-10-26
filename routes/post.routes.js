import { Router } from "express";
import { createPost,updatePost } from "../controllers/post.controller.js";
import validateSchema from "../middleware/validate.schema.js";
import validateAuth from "../middleware/validate.auth.js";
import postSchema from "../schemas/post.schema.js";

const postRouter = Router();

postRouter.post('/create-post',
validateAuth,
validateSchema(postSchema),
createPost
); // crear post
postRouter.post('/update-post',
validateAuth,
validateSchema(postSchema),
updatePost
); // crear post

export default postRouter;