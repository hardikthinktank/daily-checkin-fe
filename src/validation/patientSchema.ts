import { z } from 'zod'

export const patientSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  mrn: z.string().trim().min(1, 'MRN is required').max(64),
  diagnosis: z.string().trim().min(1, 'Diagnosis is required').max(200),
  currentDrugId: z.string().trim().min(1, 'Select a drug'),
})

export type PatientFormValues = z.infer<typeof patientSchema>

export const drugSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  isBiologicOrSimilar: z.boolean(),
})

export type DrugFormValues = z.infer<typeof drugSchema>
