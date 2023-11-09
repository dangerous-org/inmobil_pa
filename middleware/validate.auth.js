import { request, response } from "express";
import { ZodError } from "zod";

const validateSchema =
  (
    schema // recibir un schema en el metodo
  ) =>
  (req = request, res = response, next) => {
    try {
      schema.parse(req.body); // parsear el schema con los datos recibidos a través del form
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorObject = error.errors.reduce((acc, err, index) => {
          acc[`error${index}`] = err.message;
          return acc;
        }, {});
        
        return res.status(500).json(errorObject);
      }
    }
  };

export default validateSchema;
