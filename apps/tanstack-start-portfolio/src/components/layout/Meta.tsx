import { HeadContent } from '@tanstack/react-router';

export function Meta() {
  return (
    <>
      <HeadContent />
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='theme-color' content='#000000' />
      <link rel='icon' href='/favicon.ico' />
      <title>Henrik Wilhelm Sissener | Digital Artist & Developer</title>
      <meta
        name='description'
        content='Personal portfolio of Henrik Sissener, specializing in React, Svelte, and Digital Art.'
      />

      {/* OpenGraph */}
      <meta property='og:title' content='Henrik Wilhelm Sissener | Portfolio' />
      <meta
        property='og:description'
        content='Digital Artist & Frontend Developer specializing in high-performance web experiences.'
      />
      <meta property='og:type' content='website' />
      <meta property='og:url' content='https://wisihe.no' />
      <meta property='og:image' content='https://wisihe.no/og-image.jpg' />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content='Henrik Sissener | Portfolio' />
      <meta name='twitter:description' content='Digital Artist & Frontend Developer.' />
    </>
  );
}
