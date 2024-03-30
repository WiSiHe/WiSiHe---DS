'use client'
import Main from '@/components/atoms/Main/Main'

type Error = {
  message: string
}

type ErrorProps = {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  return (
    <Main className="items-center justify-center min-h-screen p-4">
      <div className="p-10 bg-white rounded h-fit">
        <h1>Something went wrong!</h1>
        <div className="py-4">
          <strong>Error:</strong>
          <div className="p-4 bg-gray-200">
            <code>{error.message}.</code>
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={() => reset()} className="px-4 py-3 text-white rounded bg-primary ">
            Try again
          </button>
        </div>
      </div>
    </Main>
  )
}
