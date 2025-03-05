import Main from 'components/atoms/Main/Main'

import type { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <Main className="flex items-center justify-center w-full min-h-screen p-4">
      <p>Loading...</p>
    </Main>
  )
}
