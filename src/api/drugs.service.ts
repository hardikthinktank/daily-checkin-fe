import { apiClient } from './client'
import type { Drug, DrugInput } from '@/types/domain'

interface DrugWire {
  id: string
  name: string
  is_biologic_or_similar: boolean
}

function mapDrug(wire: DrugWire): Drug {
  return { id: wire.id, name: wire.name, isBiologicOrSimilar: wire.is_biologic_or_similar }
}

export const drugsService = {
  list: async () => (await apiClient.get<DrugWire[]>('/drugs')).map(mapDrug),
  create: async (input: DrugInput) =>
    mapDrug(await apiClient.post<DrugWire>('/drugs', { name: input.name, is_biologic_or_similar: input.isBiologicOrSimilar })),
}
