import { z } from "zod";

 const naturalPersonSchema = z.object({
  dni: z.string(),
  nombre: z.string().min(1),
  apellido_1: z.string().min(1).max(50),
  apellido_2: z.string().min(1).max(50),
  edad: z.string(),
  pais: z.string().min(1).max(70),
  direccion: z.string().min(1).max(200),
  ciudad: z.string().min(1).max(70),
  departamento: z.string().min(1).max(70),
});
//  schema para validar los datos adicionales de un usuario de tipo persona natural
export default naturalPersonSchema;