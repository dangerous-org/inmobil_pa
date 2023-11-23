import {z} from "zod";

const postSchema = z.object({
    location : z.string().min(5,{
        message: "location must have at least 5 characters"
    }).max(70),
    price : z.string().min(4,{
        message: "price must have at least 5 characters"
    }),
})


export default postSchema;