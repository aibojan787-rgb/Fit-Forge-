import { z } from 'zod'

export const genders = ['men', 'women'] as const
export const styleIds = ['classic', 'smart-casual', 'outdoor', 'streetwear', 'minimal', 'heritage'] as const
export const occasionIds = ['work', 'weekend', 'evening', 'travel'] as const
export const paletteIds = ['navy', 'beige', 'earth', 'monochrome', 'brick'] as const

export const styleAnswersSchema = z.object({
  gender: z.enum(genders),
  styles: z.array(z.enum(styleIds)).min(1),
  occasions: z.array(z.enum(occasionIds)).min(1),
  palette: z.array(z.enum(paletteIds)).min(1),
})

export type StyleAnswers = z.infer<typeof styleAnswersSchema>
export type Gender = z.infer<typeof styleAnswersSchema>['gender']
export type StyleId = (typeof styleIds)[number]
