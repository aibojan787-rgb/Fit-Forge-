import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Notice } from '@/components/layout/notice'
import { useSaveStyle } from '@/features/style/api/use-style'
import { styleQuestions, type StyleQuestionId } from '@/features/style/questions'
import { styleAnswersSchema } from '@/features/style/types'
import { cn } from '@/lib/utils'

type Answers = Record<StyleQuestionId, string[]>

const emptyAnswers: Answers = { gender: [], styles: [], occasions: [], palette: [] }

export function StyleQuiz() {
  const navigate = useNavigate()
  const save = useSaveStyle()
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [showError, setShowError] = useState(false)

  const question = styleQuestions[stepIndex]
  const selected = answers[question.id]
  const isLast = stepIndex === styleQuestions.length - 1

  function toggle(value: string) {
    setShowError(false)
    setAnswers((prev) => {
      const current = prev[question.id]
      const next = question.multiple
        ? current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value]
        : [value]
      return { ...prev, [question.id]: next }
    })
  }

  function handleNext() {
    if (selected.length === 0) {
      setShowError(true)
      return
    }
    if (!isLast) {
      setStepIndex((index) => index + 1)
      return
    }
    const parsed = styleAnswersSchema.safeParse({
      gender: answers.gender[0],
      styles: answers.styles,
      occasions: answers.occasions,
      palette: answers.palette,
    })
    if (!parsed.success) {
      setShowError(true)
      return
    }
    save.mutate(parsed.data, {
      onSuccess: () => {
        void navigate('/onboarding/photos')
      },
    })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-brick">
          Question {stepIndex + 1} of {styleQuestions.length}
        </p>
        <h2 className="text-3xl">{question.title}</h2>
        <p className="text-muted-foreground">{question.hint}</p>
      </div>

      <div
        role={question.multiple ? 'group' : 'radiogroup'}
        aria-label={question.title}
        className="grid gap-3 sm:grid-cols-2"
      >
        {question.options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              role={question.multiple ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              onClick={() => toggle(option.value)}
              className={cn(
                'flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-colors',
                isSelected
                  ? 'border-navy bg-navy text-white'
                  : 'border-border bg-white text-foreground hover:border-navy/50',
              )}
            >
              <span className="space-y-1">
                <span className="block font-medium">{option.label}</span>
                {option.description ? (
                  <span className={cn('block text-sm', isSelected ? 'text-white/80' : 'text-muted-foreground')}>
                    {option.description}
                  </span>
                ) : null}
              </span>
              {isSelected ? <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : null}
            </button>
          )
        })}
      </div>

      {showError ? (
        <Notice tone="warning" title="Please choose at least one option to continue." />
      ) : null}
      {save.isError ? (
        <Notice tone="error" title="Could not save your answers">
          Please try again.
        </Notice>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={stepIndex === 0 || save.isPending}
          onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
        >
          Back
        </Button>
        <Button type="button" size="lg" onClick={handleNext} disabled={save.isPending}>
          {save.isPending ? 'Saving...' : isLast ? 'Finish style quiz' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
