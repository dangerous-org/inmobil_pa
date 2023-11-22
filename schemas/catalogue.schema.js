import {z} from "zod";

export const catalogueSchema = z.object({
    description : z.string().min(10),
    name : z.string().min(6).max(50)
});