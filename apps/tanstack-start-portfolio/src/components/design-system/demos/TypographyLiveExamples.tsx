import { DosDontGallery, type DosDontItem } from '../DosDontGallery';

const items: DosDontItem[] = [
  {
    label: 'Page title',
    do: <h2 className='font-serif text-3xl font-bold text-foreground'>Paintings</h2>,
    dont: <p className='font-sans text-[38px] font-bold text-neutral-800'>Paintings</p>,
  },
  {
    label: 'Label',
    do: <span className='font-mono text-xs uppercase tracking-widest text-accent'>Featured</span>,
    dont: <span className='text-sm font-black uppercase tracking-widest'>FEATURED!!!</span>,
  },
];

export function TypographyLiveExamples() {
  return <DosDontGallery items={items} />;
}
