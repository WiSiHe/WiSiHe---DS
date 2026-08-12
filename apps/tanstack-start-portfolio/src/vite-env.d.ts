/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID: string;
  readonly VITE_SANITY_DATASET: string;
  readonly VITE_SANITY_API_VERSION: string;
  readonly VITE_SANITY_API_READ_TOKEN?: string;
  readonly VITE_SANITY_PREVIEW_TOKEN?: string;
  readonly SANITY_API_READ_TOKEN?: string;
  readonly VITE_MAPBOX_TOKEN?: string;
  readonly VITE_ALGOLIA_APP_ID?: string;
  readonly VITE_ALGOLIA_SEARCH_KEY?: string;
  readonly VITE_ALGOLIA_INDEX_NAME?: string;
  readonly VITE_POSTHOG_KEY?: string;
  readonly VITE_POSTHOG_HOST?: string;
  readonly VITE_SANITY_WRITE_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@wisihe/constants' {
  export const ABOUT_PAGE_ENABLED: boolean;
  export const ABOUT_PAGE_LINKS_ENABLED: boolean;
  export const navigationItems: Array<{
    label: string;
    href: string;
    description: string;
  }>;
  export const footerLinks: Array<{ name: string; href: string }>;
  export const footerSecondaryLinks: Array<{ name: string; href: string }>;
  export const socialMediaLinks: Array<{ label: string; url: string }>;
  export const aboutMeBulletPoints: string[];
}

declare module '*.css';
