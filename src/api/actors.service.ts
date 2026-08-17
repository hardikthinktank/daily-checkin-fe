import { apiClient } from './client'
import type { Actor, ActorInput } from '@/types/domain'

interface ActorWire {
  id: string
  display_name: string
  actor_type: Actor['actorType']
  role: Actor['role']
}

function mapActor(wire: ActorWire): Actor {
  return { id: wire.id, displayName: wire.display_name, actorType: wire.actor_type, role: wire.role }
}

export const actorsService = {
  list: async () => (await apiClient.get<ActorWire[]>('/actors')).map(mapActor),
  create: async (input: ActorInput) =>
    mapActor(
      await apiClient.post<ActorWire>('/actors', {
        display_name: input.displayName,
        actor_type: input.actorType,
        role: input.role,
      }),
    ),
}
