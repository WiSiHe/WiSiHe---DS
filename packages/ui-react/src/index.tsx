'use client';

// --- Atoms ---
export { Badge, type BadgeProps } from './badge/Badge';
export {
  type BreadcrumbCrumb,
  Breadcrumbs,
  type BreadcrumbsProps,
} from './breadcrumbs/Breadcrumbs';
export { Button, type ButtonProps } from './button/Button';
// --- Molecules ---
export {
  Card,
  CardContent,
  type CardContentProps,
  CardDescription,
  type CardDescriptionProps,
  CardFooter,
  type CardFooterProps,
  CardHeader,
  type CardHeaderProps,
  type CardProps,
  CardTitle,
  type CardTitleProps,
} from './card/Card';
export { Checkbox, type CheckboxProps } from './checkbox/Checkbox';
export { Chip, type ChipProps } from './chip/Chip';
export { Combobox, type ComboboxItem, type ComboboxProps } from './combobox/Combobox';
export {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  type DialogProps,
  DialogTitle,
} from './dialog/Dialog';
// --- Layout ---
export { GlassSurface, type GlassSurfaceProps } from './glass-surface/GlassSurface';
export { IconBadge, type IconBadgeProps } from './icon-badge/IconBadge';
export { Input, type InputProps } from './input/Input';
export {
  headerStaggerContainerVariants,
  MOTION_EASE_OUT,
  MOTION_REVEAL_X,
  MOTION_REVEAL_Y,
  SECTION_REVEAL_DURATION,
  SECTION_REVEAL_VIEWPORT,
  sectionRevealTransition,
  staggerFadeUpItemVariants,
} from './motion/motionTokens';
export {
  buildPaginationItems,
  type PaginationItem,
} from './pagination/buildPaginationItems';
export { Pagination, type PaginationProps } from './pagination/Pagination';
export { BrushFrostedWash, BrushPaletteWash } from './painting-card/brush-reveal/BrushFrostedWash';
export {
  BrushRevealFrame,
  type BrushRevealFrameProps,
} from './painting-card/brush-reveal/BrushRevealFrame';
export { BrushRevealImageBlur } from './painting-card/brush-reveal/BrushRevealImageBlur';
export {
  type BrushRevealBadge,
  BrushRevealLayer,
  type BrushRevealLayerProps,
} from './painting-card/brush-reveal/BrushRevealLayer';
export { BrushRevealWrap } from './painting-card/brush-reveal/BrushRevealWrap';
export { brushWashTransition } from './painting-card/brush-reveal/brushRevealMotion';
export { NsfwContentIndicator } from './painting-card/brush-reveal/NsfwContentIndicator';
export { NsfwRestIndicator } from './painting-card/brush-reveal/NsfwRestIndicator';
export {
  type BrushPalette,
  type BrushStrokeColorSet,
  darkenHex,
  getBrushStrokeColors,
  getHeroStrokeColors,
} from './painting-card/brush-stroke/brushStrokeColors';
export {
  type BrushProfileConfig,
  type BrushStrokeProfile,
  getBrushProfileConfig,
  HERO_BRUSH_STROKE_WIDTH_HOVER,
  HERO_BRUSH_STROKE_WIDTH_REST,
  resolveBrushProfile,
} from './painting-card/brush-stroke/brushStrokeConstants';
export {
  BRUSH_STROKE_VARIANTS,
  type BrushStrokeLayer,
  type BrushStrokeVariant,
  type GridBandConfig,
  type GridBandVariantTiming,
  getBrushStrokeVariant,
  getGridBandConfig,
  paintingBrushSeed,
} from './painting-card/brush-stroke/brushStrokeVariants';
export {
  prefersDesktopPaintingGrid,
  prefersFinePointerHover,
  prefersReducedMotion,
  useCanBrushReveal,
  useIsDesktopPaintingGrid,
} from './painting-card/hooks/useMediaCapabilities';
export {
  deriveFormatFromAspectRatio,
  type PaintingCardAspectLayout,
  type PaintingFormat,
  resolvePaintingCardLayout,
} from './painting-card/layout';
export * from './painting-card/nsfwCover';
// --- Cards & Complex Molecules ---
export {
  PaintingCard,
  type PaintingCardBadge,
  type PaintingCardLayout,
  type PaintingCardProps,
} from './painting-card/PaintingCard';
export {
  type PaintingCardImageComponentProps,
  PaintingCardView,
  type PaintingCardViewProps,
} from './painting-card/PaintingCardView';
export {
  type PaintingThumbnailImageComponentProps,
  PaintingThumbnailView,
  type PaintingThumbnailViewProps,
} from './painting-card/PaintingThumbnailView';
export {
  type PhotographyCardImageComponentProps,
  PhotographyCardView,
  type PhotographyCardViewProps,
} from './photography-card/PhotographyCardView';
export {
  Popover,
  PopoverButton,
  PopoverContent,
  type PopoverContentProps,
  PopoverItem,
} from './popover/Popover';
export {
  getProjectCardTags,
  ProjectCardBadge,
  type ProjectCardBadgeProps,
  type ProjectCardImageComponentProps,
  ProjectCardImageFrame,
  type ProjectCardImageFrameProps,
  ProjectCardImageOverlay,
  type ProjectCardImageOverlayProps,
  ProjectCardTags,
  type ProjectCardTagsProps,
  ProjectCardTitleBlock,
  type ProjectCardTitleBlockProps,
} from './project-card/ProjectCardParts';
export {
  RecipeMetaBadges,
  type RecipeMetaBadgesProps,
} from './recipe-card/RecipeMetaBadges';
export {
  ScrollGrowSection,
  SectionHeader,
  type SectionHeaderProps,
} from './section-header/ScrollGrowSection';
export { Select, type SelectOption, type SelectProps } from './select/Select';
export { Skeleton, type SkeletonProps } from './skeleton/Skeleton';
export { Spinner, type SpinnerProps } from './spinner/Spinner';
export {
  Switch,
  SwitchField,
  type SwitchFieldProps,
  type SwitchProps,
} from './switch/Switch';
export {
  TabBar,
  TabContent,
  TabItem,
  TabPanel,
  Tabs,
  type TabsVariant,
} from './tabs/Tabs';
export { Tag, type TagProps } from './tag/Tag';
export { Textarea, type TextareaProps } from './textarea/Textarea';
