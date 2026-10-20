import { useNavigate } from 'react-router'
import { MeasurementForm } from '@/features/measurements/components/measurement-form'
import { MeasurementGuide } from '@/features/measurements/components/measurement-guide'

export function MeasurePage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="text-4xl">Let&apos;s get your measurements</h1>
        <p className="max-w-xl text-muted-foreground">
          Your measurements decide which sizes we suggest. Take about two minutes.
        </p>
      </div>
      <MeasurementGuide />
      <MeasurementForm onSaved={() => void navigate('/onboarding/style')} />
    </div>
  )
}
