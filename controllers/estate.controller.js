import estateModel from "../models/estate.model.js";

export const createEstate = async (req, res) => {
  await estateModel.createEstate(req, res);
};
