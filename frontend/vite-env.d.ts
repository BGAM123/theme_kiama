/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_USE_MOCKS: string;
    readonly VITE_API_URL: string;
    // ajoute d'autres variables d'environnement Vite ici si nécessaire
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};