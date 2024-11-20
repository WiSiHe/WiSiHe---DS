import { urlForImage } from '@/sanity/lib/utils';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';

interface Painting {
  image: unknown;
  slug: { current: string };
  title: string;
  alt?: string;
}

type Props = {
  painting: Painting;
  priority?: boolean;
};

const PaintingCard = ({ painting, priority = false }: Props) => {
  const { image, slug, title, alt = '' } = painting;
  return (
    <article className="within aspect-square">
      <Link href={`/paintings/${slug.current}`}>
        <h2 className="before:absolute before:inset-0 before:z-0">{title}</h2>
      </Link>
      <Image
        className="object-cover -z-10"
        fill={true}
        alt={stegaClean(alt) || ''}
        src={
          urlForImage(image)
            ?.height(320)
            .width(640)
            .auto('format')
            .url() as string
        }
        sizes="100vw"
        priority={priority}
      />
    </article>
  );
};

export default PaintingCard;
