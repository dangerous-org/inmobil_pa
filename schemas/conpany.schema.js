import { z } from "zod";

export const companiesSchema = z.object({
  nit: z.string().min(10).max(20),
  nombre: z.string().min(1).max(50),
  codigo_postal: z.string().min(6).max(10),
  direccion: z.string().min(1).max(200),
});
// schema para validad los datos adicionales de un usuario de tipo compañia

export default companiesSchema;
