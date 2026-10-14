import z from "zod"

export const productSchema = z.object({

  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  image: z.string().optional().default(""),
 

})
