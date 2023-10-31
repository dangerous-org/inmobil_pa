import { response } from "express";
import UserModel from "../models/user.js";

export const signUp = async (req = request, res = response) => {
    await UserModel.signup(req, res);
  };// controlador para crear un nuevo usuario
  
export const signIn = async(req = request, res = response) => {
    await UserModel.signIn(req,res).catch(err => console.log(err));
}//Controlador para iniciar sesion
