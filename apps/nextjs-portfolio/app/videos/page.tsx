import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Videos | WiSiHe',
  description: 'A gallery of some of my paintings',
};

export default function Paintings() {
  return (
    <main>
      <h1>Videos</h1>
      <p>A gallery of some of my paintings</p>
    </main>
  );
}
