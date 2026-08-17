import { z } from 'zod'

export const actorSchema = z.object({
  displayName: z.string().trim().min(1, 'Name is required').max(200),
  role: z.enum(['care_manager', 'physician', 'admin']),
})

export type ActorFormValues = z.infer<typeof actorSchema>
