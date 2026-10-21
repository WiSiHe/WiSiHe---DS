import { HeadContent } from '@tanstack/react-router';

export function Meta() {
  return (
    <>
      <HeadContent />
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='theme-color' content='#fafafa' media='(prefers-color-scheme: light)' />
      <meta name='theme-color' content='#0a0a0a' media='(prefers-color-scheme: dark)' />
      <link rel='icon' href='/favicon.ico' sizes='48x48' />
      <link rel='icon' href='/favicon-32x32.png' type='image/png' sizes='32x32' />
      <link rel='icon' href='/favicon-16x16.png' type='image/png' sizes='16x16' />
      <link rel='apple-touch-icon' href='/apple-touch-icon.png' sizes='180x180' />
      <link rel='manifest' href='/site.webmanifest' />
    </>
  );
}
