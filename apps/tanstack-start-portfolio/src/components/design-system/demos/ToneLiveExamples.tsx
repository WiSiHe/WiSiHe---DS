import { DosDontGallery, type DosDontItem } from '../DosDontGallery';

function Toast({ tone, message }: { tone: 'success' | 'error'; message: string }) {
  const styles =
    tone === 'success'
      ? 'border-success/30 bg-success-subtle text-success'
      : 'border-danger/30 bg-danger-subtle text-danger';

  return (
    <div className={`w-full max-w-[260px] rounded-lg border px-3 py-2 text-sm ${styles}`}>
      {message}
    </div>
  );
}

const items: DosDontItem[] = [
  {
    label: 'Success',
    do: <Toast tone='success' message='Profile updated.' />,
    dont: <Toast tone='success' message='Your profile has been successfully revamped!' />,
  },
  {
    label: 'Error',
    do: <Toast tone='error' message='Could not save. Try again.' />,
    dont: <Toast tone='error' message='Oh no! Something went wrong. So sorry!' />,
  },
  {
    label: 'CTA',
    do: (
      <button
        type='button'
        className='rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast'
      >
        View project
      </button>
    ),
    dont: (
      <button
        type='button'
        className='rounded-lg bg-accent px-4 py-2 text-sm font-black uppercase tracking-wide text-accent-contrast'
      >
        Unlock the magic!
      </button>
    ),
  },
];

export function ToneLiveExamples() {
  return <DosDontGallery items={items} />;
}
