import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paintings',
  description: 'A gallery of some of my paintings',
};

export default function Paintings() {
  return (
    <main>
      <h1>Paintings</h1>
      <p>A gallery of some of my paintings</p>
    </main>
  );
}
