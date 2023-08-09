/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROGRAM_ID: string;
  readonly VITE_NETWORK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
