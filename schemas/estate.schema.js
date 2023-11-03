import { z } from "zod";

const estateSchema = z.object({
    area: z.string().min(1),
    built_area: z.string().min(1),
    stratum: z.string().min(1),
    n_bathrooms: z.string().min(1),
    n_rooms: z.string().min(1),
    additional_desc: z.string().min(1),
})


export default estateSchema;