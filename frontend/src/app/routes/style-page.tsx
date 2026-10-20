import { StyleQuiz } from '@/features/style/components/style-quiz'

export function StylePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl">Your style</h1>
        <p className="max-w-xl text-muted-foreground">
          Four quick questions. We use your answers to choose the outfits you see first.
        </p>
      </div>
      <StyleQuiz />
    </div>
  )
}
