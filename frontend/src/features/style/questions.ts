export type StyleQuestionId = 'gender' | 'styles' | 'occasions' | 'palette'

export type StyleOption = {
  value: string
  label: string
  description?: string
}

export type StyleQuestion = {
  id: StyleQuestionId
  title: string
  hint: string
  multiple: boolean
  options: readonly StyleOption[]
}

// Question content. Answers are validated against styleAnswersSchema before saving.
export const styleQuestions: readonly StyleQuestion[] = [
  {
    id: 'gender',
    title: 'Who are you shopping for?',
    hint: 'We show men’s or women’s pieces on a model of the same gender.',
    multiple: false,
    options: [
      { value: 'men', label: 'Men’s' },
      { value: 'women', label: 'Women’s' },
    ],
  },
  {
    id: 'styles',
    title: 'Which styles feel like you?',
    hint: 'Pick one or more.',
    multiple: true,
    options: [
      { value: 'classic', label: 'Classic', description: 'Timeless tailoring and clean lines' },
      { value: 'smart-casual', label: 'Smart casual', description: 'Polished, but never stiff' },
      { value: 'outdoor', label: 'Outdoor', description: 'Practical layers for weather' },
      { value: 'streetwear', label: 'Streetwear', description: 'Relaxed fits and bold details' },
      { value: 'minimal', label: 'Minimal', description: 'Simple shapes, quiet colours' },
      { value: 'heritage', label: 'Heritage', description: 'Traditional craft and materials' },
    ],
  },
  {
    id: 'occasions',
    title: 'Where will you wear them?',
    hint: 'Pick one or more.',
    multiple: true,
    options: [
      { value: 'work', label: 'Work' },
      { value: 'weekend', label: 'Weekends' },
      { value: 'evening', label: 'Evenings out' },
      { value: 'travel', label: 'Travel' },
    ],
  },
  {
    id: 'palette',
    title: 'Which colours do you reach for?',
    hint: 'Pick one or more.',
    multiple: true,
    options: [
      { value: 'navy', label: 'Navy' },
      { value: 'beige', label: 'Beige' },
      { value: 'earth', label: 'Earth tones' },
      { value: 'monochrome', label: 'Black and white' },
      { value: 'brick', label: 'Brick red' },
    ],
  },
]
