/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_AVATAR_PROVIDER?: string
  readonly VITE_TRYON_PROVIDER?: string
  readonly VITE_IDM_VTON_SPACE?: string
  readonly VITE_HF_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
