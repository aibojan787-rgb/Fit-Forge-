// One switch for every feature API. Empty VITE_API_URL means mock data.
export const apiBaseUrl: string = import.meta.env.VITE_API_URL ?? ''

export const useMockApi: boolean = apiBaseUrl === ''
