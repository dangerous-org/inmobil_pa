import PostModel from "../models/post.model.js"

const createPost = async (req,res) => {
    await PostModel.createPost(req,res);
}

const updatePost = async (req,res) => {
    await PostModel.updatePost(req,res);
}

export {
    createPost,
    updatePost
}