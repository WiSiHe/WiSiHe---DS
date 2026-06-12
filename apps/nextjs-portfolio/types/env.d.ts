declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_ALGOLIA_APP_ID?: string;
    NEXT_PUBLIC_ALGOLIA_SEARCH_KEY?: string;
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME?: string;
    NEXT_PUBLIC_POSTHOG_KEY?: string;
    NEXT_PUBLIC_POSTHOG_HOST?: string;
    RESEND_API_KEY?: string;
    CONTACT_TO_EMAIL?: string;
    CONTACT_FROM_EMAIL?: string;
  }
}
