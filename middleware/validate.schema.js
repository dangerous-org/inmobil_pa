import { request, response } from "express";
import { ZodError } from "zod";

const validateSchema =
  (
    schema // recibir un schema en el metodo
  ) =>
  (req = request, res = response, next) => {
    try {
      schema.parse(req.body); // parsear el schema con los datos recibidos a traves del form
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(500).json(
          error.issues.map((err) => {
            return err.path + " " + err.message;
          })
        );
      }
    }
  };

export default validateSchema;
