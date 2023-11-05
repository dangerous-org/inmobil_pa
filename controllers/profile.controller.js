import ProfileModel from "../models/profile.model.js";

export const createProfile = async (req,res) => {
    await ProfileModel.createProfile(req,res);
}

export const updateProfile = async (req,res) => {
    await ProfileModel.updateProfile(req,res);
}

export const putPhoto = async (req,res) => {
    await ProfileModel.putPhoto(req,res);
}

export const putBanner = async (req,res) => {
    await ProfileModel.putBanner(req,res);
}

export const putBiography = async (req,res) => {
    await ProfileModel.putBiography(req,res);
}