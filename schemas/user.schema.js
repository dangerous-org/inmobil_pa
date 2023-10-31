import {z} from 'zod';

const userSchema = z.object({
    user : z.string().min(6,{
        message : 'Invalid User min 6 characters'
    }),
    password : z.string().min(8,{
        message : 'Invalid password min 8 characters'
    }),
    email : z.string().email(),
})

export default userSchema ;

