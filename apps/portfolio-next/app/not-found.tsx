import Main from '@/components/atoms/Main/Main'
import ErrorPage from '@/components/pages/ErrorPage'

import type { JSX } from "react";

export const metadata = {
  title: 'My Gallery',
  description: 'A gallery of some of my paintings',
  locale: 'en-US',
  type: 'website'
}

export default function NotFound(): JSX.Element {
  return (
    <Main>
      <ErrorPage />
    </Main>
  )
}
