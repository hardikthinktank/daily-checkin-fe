import { z } from 'zod'

export const checkInSchema = z.object({
  fatigue: z.number({ error: 'Rate fatigue from 1 to 10.' }).int().min(1).max(10),
  pain: z.number({ error: 'Rate pain from 1 to 10.' }).int().min(1).max(10),
  swelling: z.number({ error: 'Rate swelling from 1 to 10.' }).int().min(1).max(10),
})

export type CheckInFormValues = z.infer<typeof checkInSchema>
