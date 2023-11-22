import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
  getPost,
  searchByType,
  getPics,
} from "../controllers/post.controller.js";
import validateSchema from "../middleware/validate.schema.js";
import validateAuth from "../middleware/validate.auth.js";
import postSchema from "../schemas/post.schema.js";

const postRouter = Router();

postRouter.post(
  "/create-post",
  validateAuth,
  // validateSchema(postSchema)
  createPost
); // crear post

postRouter.post("/search-type", searchByType); // buscar por tipo

postRouter.put(
  "/update-post/:post_id",
  validateAuth,
  validateSchema(postSchema),
  updatePost
); // actualizar post

postRouter.delete("/delete-post/:post_id", validateAuth, deletePost); // eliminar post

postRouter.get("/get-posts", getPosts); // Obtener todos los post

postRouter.get("/get-post/:post_id", getPost);
// Obtener un post mediante su id

postRouter.get("/get-pics/:post_id", getPics); //obtener las fotos
export default postRouter;
