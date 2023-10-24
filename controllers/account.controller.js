import AcoountModel from "../models/account.model.js";

export const createNaturalPerson = async (req, res) => {
  await AcoountModel.natural_persona(req, res);
};
