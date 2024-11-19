import Image from 'next/image';

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Image
        src="/images/paintings/cloud.jpg"
        alt="Paintings | WiSiHe"
        width={720}
        height={430}
      />

      <p>A gallery of some of my paintings</p>
    </main>
  );
}
