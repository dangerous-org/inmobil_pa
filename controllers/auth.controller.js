import { request, response } from "express";
import authModel from "../models/auth.model.js";

export const signUp = async (req = request, res = response) => {
  await authModel.signup(req, res);
}; // controlador para crear un nuevo usuario

export const signIn = async (req = request, res = response) => {
  await authModel.signIn(req, res);
}; //Controlador para iniciar sesion

export const verifyToken = async (req = request, res = response) => {
  await authModel.verifyToken(req, res);
};

export const googleVerify = async(req, res)=>{
  await authModel.googleAuth(req, res);
}

export const logOut = (req = request, res = response) => {
  res.cookie("authToken", "", {
    expires: new Date(0),
  });
  return res.status(200).json({ message: "log out succesfully" });
}; // controlador para cerrar sesion

export const followUser = async (req = request, res = response) => {
  await authModel.followUser(req, res);
};

export const unfollow = async (req = request, res = response) => {
  await authModel.unfollow(req, res);
};
