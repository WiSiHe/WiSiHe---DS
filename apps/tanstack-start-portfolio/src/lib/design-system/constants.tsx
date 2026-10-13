import {
  IconBolt,
  IconBoxPadding,
  IconHome,
  IconIcons,
  IconPalette,
  IconRuler2,
  IconSpeakerphone,
  IconStack2,
  IconTypography,
} from '@tabler/icons-react';

const navIconClass = 'size-4 stroke-[2]';

export const navItems = [
  {
    name: 'Introduction',
    href: '/design-system',
    icon: <IconHome className={navIconClass} aria-hidden />,
  },
  {
    name: 'Principles',
    href: '/design-system/principles',
    icon: <IconRuler2 className={navIconClass} aria-hidden />,
  },
  {
    name: 'Colors',
    href: '/design-system/colors',
    icon: <IconPalette className={navIconClass} aria-hidden />,
  },
  {
    name: 'Typography',
    href: '/design-system/typography',
    icon: <IconTypography className={navIconClass} aria-hidden />,
  },
  {
    name: 'Layout',
    href: '/design-system/layout',
    icon: <IconBoxPadding className={navIconClass} aria-hidden />,
  },
  {
    name: 'Iconography',
    href: '/design-system/iconography',
    icon: <IconIcons className={navIconClass} aria-hidden />,
  },
  {
    name: 'Motion',
    href: '/design-system/motion',
    icon: <IconBolt className={navIconClass} aria-hidden />,
  },
  {
    name: 'Components',
    href: '/design-system/components',
    icon: <IconStack2 className={navIconClass} aria-hidden />,
  },
  {
    name: 'Tone of Voice',
    href: '/design-system/tone-of-voice',
    icon: <IconSpeakerphone className={navIconClass} aria-hidden />,
  },
] as const;
