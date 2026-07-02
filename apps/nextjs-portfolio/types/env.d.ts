declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_ALGOLIA_APP_ID?: string;
    NEXT_PUBLIC_ALGOLIA_SEARCH_KEY?: string;
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME?: string;
    NEXT_PUBLIC_POSTHOG_KEY?: string;
    NEXT_PUBLIC_POSTHOG_HOST?: string;
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?: string;
    NEXT_PUBLIC_STORYBOOK_URL?: string;
    RESEND_API_KEY?: string;
    CONTACT_TO_EMAIL?: string;
    CONTACT_FROM_EMAIL?: string;
    OPENAI_API_KEY?: string;
    OPENAI_TAG_SUGGEST_MODEL?: string;
    /** @deprecated Use SANITY_AI_PROXY_SECRET */
    SANITY_AI_BULK_SECRET?: string;
    SANITY_AI_PROXY_SECRET?: string;
    /** @deprecated Use SANITY_AI_PROXY_ALLOWED_ORIGINS */
    SANITY_AI_BULK_ALLOWED_ORIGINS?: string;
    SANITY_AI_PROXY_ALLOWED_ORIGINS?: string;
    YOUTUBE_API_KEY?: string;
  }
}
