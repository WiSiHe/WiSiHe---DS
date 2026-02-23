'use client';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

const modalVariants = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  panel: {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 30, opacity: 0 },
  },
};

const modalPanelStyles = cva('fixed inset-0 z-50 flex items-center justify-center p-4', {
  variants: {
    size: {
      sm: 'max-w-sm w-full',
      md: 'max-w-md w-full',
      lg: 'max-w-lg w-full',
      xl: 'max-w-xl w-full',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const modalContentStyles = cva('bg-white rounded-lg shadow-lg p-6 w-full', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const modalTitleStyles = cva('text-lg font-semibold mb-2');
const modalDescriptionStyles = cva('text-sm text-gray-500 mb-4');

interface ModalProps extends VariantProps<typeof modalPanelStyles> {
  title: string;
  description: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  panelClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const Modal = ({
  title,
  description,
  children,
  open,
  onClose,
  size,
  panelClassName,
  titleClassName,
  descriptionClassName,
}: ModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose} className='relative z-50'>
          <motion.div
            className='fixed inset-0 bg-black/60 backdrop-blur-sm'
            initial='initial'
            animate='animate'
            exit='exit'
            variants={modalVariants.overlay}
          />
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-full p-4'>
              <motion.div
                className={`${modalPanelStyles({ size })} ${panelClassName}`}
                initial='initial'
                animate='animate'
                exit='exit'
                variants={modalVariants.panel}
              >
                <DialogPanel className={`${modalContentStyles()}`}>
                  <DialogTitle className={`${modalTitleStyles()} ${titleClassName}`}>
                    {title}
                  </DialogTitle>
                  <Description className={`${modalDescriptionStyles()} ${descriptionClassName}`}>
                    {description}
                  </Description>
                  {children}
                </DialogPanel>
              </motion.div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
