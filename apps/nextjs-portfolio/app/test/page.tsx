import Link from 'next/link';

import TokyoLandingPage from '../components/Tokyo/TokyoLandingPage';
import { BiExpandAlt } from 'react-icons/bi';

export default async function TokyoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-5 pt-20 bg-white">
      <p className="text-dark">Shared by you</p>
      <TokyoLandingPage />
      <Link
        href="/test/tokyo"
        className="p-3 text-4xl text-white bg-black rounded-full"
      >
        <BiExpandAlt />
      </Link>
    </div>
  );
}
