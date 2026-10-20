import { mockDelay, readMockItem, writeMockItem } from '@/lib/mock-db'
import { styleAnswersSchema, type StyleAnswers } from '@/features/style/types'

export interface StyleApi {
  getStyle(): Promise<StyleAnswers | null>
  saveStyle(input: StyleAnswers): Promise<StyleAnswers>
}

const STYLE_KEY = 'style'

const mockStyleApi: StyleApi = {
  async getStyle() {
    await mockDelay(120)
    return readMockItem(STYLE_KEY, styleAnswersSchema)
  },

  async saveStyle(input) {
    await mockDelay()
    const parsed = styleAnswersSchema.parse(input)
    writeMockItem(STYLE_KEY, parsed)
    return parsed
  },
}

// Mock is the only implementation for now. A backend implementation goes here,
// selected by useMockApi from src/lib/api-config.ts.
export const styleApi: StyleApi = mockStyleApi
