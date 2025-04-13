import Link from 'next/link';
import GridDistortion from '../GridDistortion/GridDistortion';

const randomImageArray = [
  '/images/bathtub.jpg',
  '/images/celestial.jpg',
  '/images/cloud.jpg',
  '/images/cute.jpg',
  '/images/space.jpg',
  '/images/winter.jpg',
  '/images/sunlight.jpg',
];

const NotFoundSection = () => {
  return (
    <section className="relative grid w-full h-full grid-flow-col-dense bg-tertiary aspect-square xl:aspect-video overflow-clip">
      <GridDistortion
        grid={10}
        mouse={0.1}
        strength={0.15}
        relaxation={0.9}
        imageSrc={randomImageArray[5]}
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center p-4 mx-auto my-auto text-center text-white pointer-events-none h-fit w-fit">
        <div className="text-xs">
          <h2>
            <strong>Still not convinced?</strong>
          </h2>
          <div className="pb-4">Come on, just a little peak, I dare you!</div>
        </div>
        <div className="flex justify-center pt-4">
          <Link
            href="/paintings"
            className="px-4 py-2 bg-white rounded-full pointer-events-auto text-dark hover:bg-white/90"
          >
            <strong>Paintings</strong>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundSection;
