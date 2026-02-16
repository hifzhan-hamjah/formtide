import { z } from "zod";

export const createFormSchema = z.object({
  name: z.string().min(1),
  ownerEmail: z.string().email().optional(),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;
