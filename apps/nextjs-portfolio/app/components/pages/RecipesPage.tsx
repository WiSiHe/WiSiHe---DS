'use client';

import { Button } from '@wisihe/ui-react';
import { motion } from 'motion/react';

const RecipesPage = () => {
  return (
    <div>
      <h1>Recipes</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='bg-accent'
      ></motion.div>
      <Button>Click me</Button>
    </div>
  );
};
export default RecipesPage;
