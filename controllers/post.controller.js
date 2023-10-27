import PostModel from "../models/post.model.js"

export const createPost = async (req,res) => {
    await PostModel.createPost(req,res);
}

export const updatePost = async (req,res) => {
    await PostModel.updatePost(req,res);
}

export const deletePost = async (req,res) => {
    await PostModel.deletePost(req,res);
}

export const getPosts = async(req,res) => {
    await PostModel.getPosts(req,res);
}

export const getPost = async(req,res) => {
    await PostModel.getPost(req,res);
}