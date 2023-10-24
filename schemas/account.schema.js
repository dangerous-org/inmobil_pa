import { z } from "zod";

export const naturalPersonSchema = z.object({
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

export const companies = z.object({
  nit: z.number().int().gte(10).lte(20).nonnegative(),
  nombre: z.string().min(1).max(50),
  codigo_postal: z.number().int().gte(6).lte(10),
  direccion: z.string().min(1).max(200),
});
// schema para validad los datos adicionales de un usuario de tipo compañia
