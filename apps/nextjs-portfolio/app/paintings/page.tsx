import RecipesPage from '@/components/pages/RecipesPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paintings | WiSiHe',
  description: 'A gallery of some of my paintings',
};

export default function Paintings() {
  return (
    <main>
      <h1>Paintings</h1>
      <p>A gallery of some of my paintings</p>
      <RecipesPage />
    </main>
  );
}
