'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { BiChat } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';

export const TokyoPage = () => {
  return (
    <motion.div
      layout
      className='relative flex items-end justify-center w-full h-full min-h-screen'
    >
      <motion.div layoutId='tokyo-image' className='absolute w-full h-full'>
        <Image
          src='https://w.wallhaven.cc/full/yj/wallhaven-yjmmvx.jpg'
          alt='Tokyo'
          fill
          className='object-cover'
        />
      </motion.div>
      <Link href='/test' className='absolute p-3 text-2xl text-white rounded-full left-4 top-20'>
        <IoClose />
      </Link>

      <div className='relative z-10 flex items-end justify-between w-full p-10 font-semibold text-white'>
        <div>
          <motion.h1
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring' }}
            layoutId='tokyo-title'
            className='text-6xl font-bold'
          >
            Lost in Tokyo
          </motion.h1>
          <motion.p initial={{ y: 50 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
            By Johnatan Vik
          </motion.p>
        </div>

        <motion.button
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          className='flex items-center gap-2 text-white rounded-full'
        >
          8 <BiChat />
        </motion.button>
      </div>
    </motion.div>
  );
};
export default TokyoPage;
