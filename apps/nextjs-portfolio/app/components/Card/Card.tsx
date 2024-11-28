'use client';
import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlurImage } from '../BlurImage/BlurImage';
import Chip from '../Chip/Chip';

type Card = {
  src: string;
  title: string;
  categories: { name: string }[];
  href: string;
  //   content: React.ReactNode;
};

export const Card = ({
  card,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  //   const [open, setOpen] = useState(false);
  //   const containerRef = useRef<HTMLDivElement>(null);
  //   const { onCardClose, currentIndex } = useContext(CarouselContext);

  //   useEffect(() => {
  //     function onKeyDown(event: KeyboardEvent) {
  //       if (event.key === 'Escape') {
  //         handleClose();
  //       }
  //     }

  //     if (open) {
  //       document.body.style.overflow = 'hidden';
  //     } else {
  //       document.body.style.overflow = 'auto';
  //     }

  //     window.addEventListener('keydown', onKeyDown);
  //     return () => window.removeEventListener('keydown', onKeyDown);
  //   }, [open]);

  //   useOutsideClick(containerRef, () => handleClose());

  //   const handleOpen = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = () => {
  //     setOpen(false);
  //     onCardClose(index);
  //   };

  const tagsVariants = {
    rest: { opacity: 0, y: -20 },
    hover: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const tagVariants = {
    rest: { opacity: 0, y: -20 },
    hover: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      //   ref={containerRef}
      layoutId={layout ? `card-${card.title}` : undefined}
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="rounded-3xl bg-gray-100 dark:bg-neutral-900 group h-80 w-56 md:h-[40rem] md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10"
    >
      <div className="absolute inset-x-0 top-0 z-30 h-full pointer-events-none bg-gradient-to-b from-dark/50 via-transparent to-transparent" />
      <div className="relative z-40 w-full p-8">
        <motion.h3
          // layoutId={layout ? `title-${card.title}` : undefined}
          className="max-w-xs font-sans text-xl font-semibold text-left text-white md:text-3xl text-balance"
        >
          {card.title}
        </motion.h3>
        <motion.div
          variants={tagsVariants}
          className="flex flex-wrap gap-2 pt-2"
        >
          {card.categories.map((category) => (
            <motion.div
              variants={tagVariants}
              key={category.name}
              className="font-sans text-xs text-left text-white group md:text-base"
            >
              <Chip label={category.name} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <motion.div className="absolute z-20 text-white bottom-4 right-4">
        <Link
          href={card.href}
          className="flex gap-1 px-3 py-1 rounded-full bg-primary hover:bg-primary/90"
        >
          View <IconArrowRight />
        </Link>
      </motion.div>
      <BlurImage
        src={card.src}
        alt={card.title}
        fill
        className="absolute inset-0 z-10 object-cover"
      />
    </motion.div>
  );
};
