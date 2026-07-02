declare namespace NodeJS {
  interface ProcessEnv {
    SANITY_STUDIO_PROJECT_ID: string;
    SANITY_STUDIO_DATASET: string;
    SANITY_STUDIO_PREVIEW_URL: string;
    /** @deprecated Use SANITY_STUDIO_PROJECT_ID */
    SANITY_STUDIO_API_PROJECT_ID: string;
    /** @deprecated Use SANITY_STUDIO_DATASET */
    SANITY_STUDIO_API_DATASET: string;
    SANITY_API_READ_TOKEN: string;
    SANITY_API_WRITE_TOKEN: string;
    ALGOLIA_APP_ID: string;
    ALGOLIA_WRITE_KEY: string;
    ALGOLIA_INDEX_NAME: string;
    OPENAI_API_KEY: string;
    /** @deprecated Use OPENAI_API_KEY */
    SANITY_STUDIO_OPENAI_API_KEY: string;
  }
}
