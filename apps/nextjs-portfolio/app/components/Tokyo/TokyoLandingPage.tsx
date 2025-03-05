'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export const TokyoLandingPage = () => {
  return (
    <>
      <motion.article layout className="">
        <motion.div
          layoutId="tokyo-image"
          className="relative w-full rounded-lg text-dark aspect-square overflow-clip"
        >
          <Image
            src="https://w.wallhaven.cc/full/yj/wallhaven-yjmmvx.jpg"
            alt="Tokyo"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="flex flex-col items-center justify-center gap-4 text-center pt-7 ">
          <motion.h1 className="text-5xl font-bold text-dark">
            Lost in Tokyo
          </motion.h1>
          <p className="text-balance text-dark">
            Cras mattis consentetur purus sit amet fermentum. Maecenas sed diam
            eget rius varius blandit sit amet non magna.
          </p>
        </div>
      </motion.article>
    </>
  );
};
export default TokyoLandingPage;
