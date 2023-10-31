import ProfileModel from "../models/profile.model.js";

export const createProfile = async (req,res) => {
    await ProfileModel.createProfile(req,res);
}

export const updateProfile = async (req,res) => {
    await ProfileModel.updateProfile(req,res);
}