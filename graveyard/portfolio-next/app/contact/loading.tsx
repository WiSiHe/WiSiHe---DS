import Loader from 'components/atoms/Loader/Loader'
import Main from 'components/atoms/Main/Main'

import type { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <Main className="grid min-h-screen grid-cols-12 gap-4 p-4">
      <Loader />
    </Main>
  )
}
