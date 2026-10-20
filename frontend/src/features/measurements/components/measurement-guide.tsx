import { Layers, PersonStanding, Ruler, Scale, Shirt } from 'lucide-react'

const steps = [
  {
    icon: Ruler,
    title: 'Height',
    text: 'Stand straight against a wall with heels together and shoes off.',
  },
  {
    icon: Shirt,
    title: 'Chest',
    text: 'Wrap the tape around the fullest part of the chest, under the arms, keeping it level.',
  },
  {
    icon: Scale,
    title: 'Waist',
    text: 'Measure around your natural waistline, just above the belly button. Breathe out and relax.',
  },
  {
    icon: Layers,
    title: 'Hips',
    text: 'Measure around the fullest part of the seat, with your feet together.',
  },
  {
    icon: PersonStanding,
    title: 'Inseam',
    text: 'Measure from the crotch down to the ankle bone, using trousers that fit you well.',
  },
] as const

export function MeasurementGuide() {
  return (
    <section aria-labelledby="guide-heading" className="space-y-5">
      <h2 id="guide-heading" className="text-2xl">
        How to measure
      </h2>
      <p className="text-muted-foreground">
        Use a soft tape measure and ask someone to help if you can. Measurements are in centimetres.
      </p>
      <ol className="grid gap-4 sm:grid-cols-2">
        {steps.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4 rounded-2xl border border-border bg-white p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-beige text-navy">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <h3 className="font-sans text-base font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
