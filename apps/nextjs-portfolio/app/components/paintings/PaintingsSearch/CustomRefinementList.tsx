'use client';

import { Checkbox } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import {
  FaBook,
  FaDragon,
  FaFilm,
  FaFlag,
  FaGamepad,
  FaLeaf,
  FaMagic,
  FaMountain,
  FaPalette,
  FaPaw,
  FaRocket,
  FaSkull,
  FaSnowflake,
  FaStar,
  FaUser,
  FaWater,
} from 'react-icons/fa';
import { IoMusicalNotes } from 'react-icons/io5';
import { MdAnimation } from 'react-icons/md';
import { useRefinementList } from 'react-instantsearch';

/** How many items to show initially */
const DEFAULT_VISIBLE = 10;

/** Map tag names to small icons */
const TAG_ICONS: Record<string, React.ReactNode> = {
  Woman: <FaUser className='w-3 h-3' />,
  Man: <FaUser className='w-3 h-3' />,
  Portrait: <FaUser className='w-3 h-3' />,
  'Self Portrait': <FaUser className='w-3 h-3' />,
  Landscape: <FaMountain className='w-3 h-3' />,
  Mountain: <FaMountain className='w-3 h-3' />,
  Nature: <FaLeaf className='w-3 h-3' />,
  Fantasy: <FaMagic className='w-3 h-3' />,
  Magic: <FaMagic className='w-3 h-3' />,
  'Concept Art': <FaPalette className='w-3 h-3' />,
  Babel: <FaMountain className='w-3 h-3' />,
  'Sci-Fi': <FaRocket className='w-3 h-3' />,
  Universe: <FaStar className='w-3 h-3' />,
  Winter: <FaSnowflake className='w-3 h-3' />,
  Animal: <FaPaw className='w-3 h-3' />,
  Horror: <FaSkull className='w-3 h-3' />,
  'Dark Souls': <FaSkull className='w-3 h-3' />,
  Anime: <MdAnimation className='w-3 h-3' />,
  Animation: <MdAnimation className='w-3 h-3' />,
  Game: <FaGamepad className='w-3 h-3' />,
  Music: <IoMusicalNotes className='w-3 h-3' />,
  Books: <FaBook className='w-3 h-3' />,
  Movies: <FaFilm className='w-3 h-3' />,
  Sea: <FaWater className='w-3 h-3' />,
  Norway: <FaFlag className='w-3 h-3' />,
  Rotoscope: <FaFilm className='w-3 h-3' />,
  'Comic Book': <FaBook className='w-3 h-3' />,
  Dragon: <FaDragon className='w-3 h-3' />,
  Fanart: <FaStar className='w-3 h-3' />,
};

export default function CustomRefinementList(props: Parameters<typeof useRefinementList>[0]) {
  const { items, refine } = useRefinementList(props);
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleItems = isExpanded ? items : items.slice(0, DEFAULT_VISIBLE);
  const hiddenCount = items.length - DEFAULT_VISIBLE;
  const canToggle = items.length > DEFAULT_VISIBLE;

  return (
    <div className='flex flex-col gap-1'>
      <AnimatePresence initial={false}>
        <motion.ul layout className='flex flex-col gap-0.5 w-full'>
          {visibleItems.map(item => {
            const icon = TAG_ICONS[item.label];
            return (
              <motion.li
                key={item.value}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className='w-full overflow-hidden'
              >
                <button
                  type='button'
                  onClick={() => refine(item.value)}
                  className={cn(
                    'flex items-center gap-2.5 cursor-pointer group w-full text-sm transition-colors py-1.5 px-2 rounded-lg',
                    item.isRefined
                      ? 'bg-accent/10 text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Checkbox
                    inputSize='sm'
                    checked={item.isRefined}
                    onChange={() => refine(item.value)}
                    label={item.label}
                    labelClassName='grow truncate min-w-0 text-sm cursor-pointer'
                  />
                  {icon && (
                    <span
                      className={cn(
                        'shrink-0 transition-colors',
                        item.isRefined
                          ? 'text-accent'
                          : 'text-muted-foreground/50 group-hover:text-muted-foreground',
                      )}
                    >
                      {icon}
                    </span>
                  )}
                  <span
                    className={cn(
                      'text-xs px-1.5 py-0.5 rounded-full font-medium transition-colors shrink-0 min-w-[1.5rem] text-center',
                      item.isRefined ? 'bg-accent/20 text-accent' : 'text-muted-foreground',
                    )}
                  >
                    {item.count}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </AnimatePresence>

      {canToggle && (
        <button
          type='button'
          onClick={() => setIsExpanded(v => !v)}
          className='mt-1 text-xs text-foreground-muted hover:text-accent transition-colors text-left pl-2 w-fit'
        >
          {isExpanded ? '↑ Show fewer' : `↓ Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  );
}
