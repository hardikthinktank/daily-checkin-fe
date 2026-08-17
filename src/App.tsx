import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ToastProvider } from '@/components/ui/Toast'
import { SkeletonRows } from '@/components/ui/Skeleton'

const PatientCheckInPage = lazy(() => import('@/features/patient-app/PatientCheckInPage').then((m) => ({ default: m.PatientCheckInPage })))
const WorkListPage = lazy(() => import('@/features/care-manager/WorkListPage').then((m) => ({ default: m.WorkListPage })))
const AdminListPage = lazy(() => import('@/features/admin/AdminListPage').then((m) => ({ default: m.AdminListPage })))
const MonthlySummaryPage = lazy(() =>
  import('@/features/physician-summary/MonthlySummaryPage').then((m) => ({ default: m.MonthlySummaryPage })),
)

function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-medium text-slate-900">Page not found</p>
      <p className="mt-1 text-sm text-slate-500">Use the navigation above to pick a screen.</p>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="mx-auto max-w-4xl py-6"><SkeletonRows rows={4} /></div>}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/patient" replace />} />
            <Route path="patient" element={<PatientCheckInPage />} />
            <Route path="care-manager" element={<WorkListPage />} />
            <Route path="care-manager/:flagId" element={<WorkListPage />} />
            <Route path="admin" element={<AdminListPage />} />
            <Route path="physician" element={<MonthlySummaryPage />} />
            <Route path="physician/:patientId" element={<MonthlySummaryPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ToastProvider>
  )
}
