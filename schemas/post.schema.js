
import {string, z} from "zod";

const postSchema = z.object({
    location : z.string().min(10).max(70),
    precio : z.string().min(4),
    
})


export default postSchema;