export const queryKeys = {
  patients: {
    all: ['patients'] as const,
    detail: (id: string) => ['patients', id] as const,
  },
  drugs: {
    all: ['drugs'] as const,
  },
  actors: {
    all: ['actors'] as const,
  },
  flags: {
    // GET /care-manager/worklist takes no params (level filtering, if any, is
    // done client-side over the full result).
    workList: ['flags', 'work-list'] as const,
    detail: (id: string) => ['flags', id] as const,
  },
  admin: {
    rows: (month?: string) => ['admin', 'rows', month ?? 'current'] as const,
  },
  summary: {
    detail: (patientId: string, month?: string) => ['summary', patientId, month ?? 'current'] as const,
  },
  rules: {
    all: (activeOnly?: boolean) => ['rules', activeOnly ?? true] as const,
  },
}
