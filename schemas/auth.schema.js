import { z } from "zod";

export const userSchemaSignUp = z.object({
  user: z.string().min(6, {
    message: "Invalid User min 6 characters",
  }).max(15),
  password: z.string().min(8, {
    message: "Invalid password min 8 characters",
  }),
  email: z.string().email(),
}); // schema para validad el sign up

export const userSchemaSignIn = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "invalid password min 6 characteres",
  }),
}); // schema para validar el sign In
