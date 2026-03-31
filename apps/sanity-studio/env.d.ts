declare namespace NodeJS {
  interface ProcessEnv {
    SANITY_STUDIO_PROJECT_ID: string;
    SANITY_STUDIO_DATASET: string;
    SANITY_STUDIO_PREVIEW_URL: string;
    SANITY_STUDIO_API_PROJECT_ID: string;
    SANITY_STUDIO_API_DATASET: string;
    SANITY_STUDIO_OPENAI_API_KEY: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
