import { Router } from "express";
import { createPost,deletePost,getPosts,updatePost,getPost } from "../controllers/post.controller.js";
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
); // actualizar post

postRouter.post('/delete-post',
validateAuth,
deletePost); // eliminar post

postRouter.get('/get-posts',
getPosts); // Obtener todos los post

postRouter.get('/get-post',
getPost); // Obtener un post mediante su id
export default postRouter;