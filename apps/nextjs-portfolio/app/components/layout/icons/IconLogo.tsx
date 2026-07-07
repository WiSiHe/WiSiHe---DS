import { cn } from '@wisihe/utils';
import type React from 'react';
import { ICON_LOGO_PATHS } from './iconLogoPaths';

export interface IconLogoProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
  /**
   * Size of the icon. Can be a number (pixels) or string (e.g., "2rem", "24px")
   * @default 24
   */
  size?: number | string;
  /**
   * Color of the icon. Use "currentColor" for theme-aware colors
   * @default "currentColor"
   */
  color?: string;
  /**
   * Additional className
   */
  className?: string;
}

/** Static WiSiHe mark — footer and non-animated contexts. */
const IconLogo = ({
  size = 24,
  color = 'currentColor',
  className,
  width,
  height,
  fill,
  ...props
}: IconLogoProps) => {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  const finalWidth = width || sizeValue;
  const finalHeight = height || sizeValue;
  const finalFill = fill || color;

  return (
    <svg
      width={finalWidth}
      height={finalHeight}
      viewBox='0 0 512 512'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('inline-block', className)}
      {...props}
    >
      {ICON_LOGO_PATHS.map(pathDef => (
        <path key={pathDef.id} d={pathDef.d} fill={finalFill} />
      ))}
    </svg>
  );
};

export default IconLogo;
