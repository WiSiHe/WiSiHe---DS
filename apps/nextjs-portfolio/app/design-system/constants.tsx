import { FaBullhorn, FaFont, FaHome, FaLayerGroup, FaPalette } from 'react-icons/fa';

export const navItems = [
  { name: 'Introduction', href: '/design-system', icon: <FaHome /> },
  { name: 'Colors', href: '/design-system/colors', icon: <FaPalette /> },
  { name: 'Typography', href: '/design-system/typography', icon: <FaFont /> },
  { name: 'Tone of Voice', href: '/design-system/tone-of-voice', icon: <FaBullhorn /> },
  { name: 'Components', href: '#', icon: <FaLayerGroup />, disabled: true },
];
