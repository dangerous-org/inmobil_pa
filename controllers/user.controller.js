import { request, response } from "express";
import UserModel from "../models/user.model.js";

export const signUp = async (req = request, res = response) => {
    await UserModel.signup(req, res);
  };// controlador para crear un nuevo usuario
  
export const signIn = async(req = request, res = response) => {
    await UserModel.signIn(req,res);
}//Controlador para iniciar sesion

export const logOut = (req = request, res = response)=>{
  res.cookie("authToken", "",{
    expires: new Date(0),
  });
  return res.status(200).json({message: "log out succesfuly"});
}