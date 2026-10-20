import { MeasurementsManager } from '@/features/measurements/components/measurements-manager'

export function MeasurementsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl">Your measurements</h1>
        <p className="max-w-xl text-muted-foreground">
          Sizes are based on these numbers. Edit them any time, or delete them and add new ones.
        </p>
      </div>
      <MeasurementsManager />
    </div>
  )
}
