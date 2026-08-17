import { apiClient } from './client'
import type { Patient, PatientInput } from '@/types/domain'

interface PatientWire {
  id: string
  name: string
  mrn: string
  diagnosis: string
  current_drug: { id: string; name: string; is_biologic_or_similar: boolean }
  enrollment_date: string
}

function mapPatient(wire: PatientWire): Patient {
  return {
    id: wire.id,
    name: wire.name,
    mrn: wire.mrn,
    diagnosis: wire.diagnosis,
    currentDrug: {
      id: wire.current_drug.id,
      name: wire.current_drug.name,
      isBiologicOrSimilar: wire.current_drug.is_biologic_or_similar,
    },
    enrollmentDate: wire.enrollment_date,
  }
}

// No PATCH/PUT /patients/{id} exists on the real API — editing an enrolled
// patient isn't possible from this frontend. Only list/get/create.
export const patientsService = {
  list: async () => (await apiClient.get<PatientWire[]>('/patients')).map(mapPatient),
  get: async (id: string) => mapPatient(await apiClient.get<PatientWire>(`/patients/${id}`)),
  create: async (input: PatientInput) =>
    mapPatient(
      await apiClient.post<PatientWire>('/patients', {
        name: input.name,
        mrn: input.mrn,
        diagnosis: input.diagnosis,
        current_drug_id: input.currentDrugId,
      }),
    ),
}
