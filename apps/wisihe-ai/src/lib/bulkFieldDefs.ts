export type FieldType = 'boolean' | 'select' | 'text' | 'date' | 'datetime';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: FieldOption[];
  description?: string;
  placeholder?: string;
  defaultValue?: unknown;
}

export const BULK_FIELD_DEFS: Record<string, FieldDef[]> = {
  painting: [
    {
      name: 'isFeatured',
      label: 'Featured',
      type: 'boolean',
      description: 'Highlight painting in featured sections',
      defaultValue: true,
    },
    {
      name: 'isForSale',
      label: 'For Sale',
      type: 'boolean',
      description: 'Available for purchase as prints / merch',
      defaultValue: true,
    },
    {
      name: 'isNSFW',
      label: 'NSFW',
      type: 'boolean',
      description: 'Contains sensitive or mature content',
      defaultValue: false,
    },
    {
      name: 'isFanArt',
      label: 'Fan Art',
      type: 'boolean',
      description: 'Derived from an existing IP or character',
      defaultValue: false,
    },
    {
      name: 'medium',
      label: 'Medium',
      type: 'select',
      options: [
        { label: 'Digital (Procreate)', value: 'Digital (Procreate)' },
        { label: 'Digital (Photoshop)', value: 'Digital (Photoshop)' },
        { label: 'Digital (Other)', value: 'Digital (Other)' },
        { label: 'Oil on canvas', value: 'Oil on canvas' },
        { label: 'Watercolour', value: 'Watercolour' },
        { label: 'Pencil / Ink', value: 'Pencil / Ink' },
      ],
      defaultValue: 'Digital (Procreate)',
    },
    {
      name: 'format',
      label: 'Format (Aspect)',
      type: 'select',
      options: [
        { label: 'Square', value: 'square' },
        { label: 'Landscape', value: 'landscape' },
        { label: 'Portrait', value: 'portrait' },
      ],
      defaultValue: 'square',
    },
    {
      name: 'paintedAt',
      label: 'Painted At',
      type: 'datetime',
      description: 'Date/time when the painting was created',
    },
    {
      name: 'redbubbleUrl',
      label: 'Redbubble URL',
      type: 'text',
      placeholder: 'https://www.redbubble.com/people/...',
    },
    {
      name: 'gelatoUrl',
      label: 'Gelato URL',
      type: 'text',
      placeholder: 'https://...',
    },
  ],
  project: [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'On Hold', value: 'on-hold' },
        { label: 'Abandoned', value: 'abandoned' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'completed',
    },
    {
      name: 'projectType',
      label: 'Project Type',
      type: 'select',
      options: [
        { label: 'Web', value: 'web' },
        { label: 'Game', value: 'game' },
        { label: 'Art', value: 'art' },
        { label: 'Design', value: 'design' },
        { label: 'Concept', value: 'concept' },
        { label: '3D', value: '3d' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'art',
    },
    {
      name: 'client',
      label: 'Client',
      type: 'text',
      placeholder: 'Client or studio name',
    },
    {
      name: 'connectedPage',
      label: 'Live Page URL',
      type: 'text',
      placeholder: 'https://example.com/project',
    },
    {
      name: 'projectStart',
      label: 'Start Date',
      type: 'date',
    },
    {
      name: 'projectEnd',
      label: 'End Date',
      type: 'date',
    },
  ],
  photography: [
    {
      name: 'isFeatured',
      label: 'Featured',
      type: 'boolean',
      description: 'Highlight photo in featured sections',
      defaultValue: true,
    },
    {
      name: 'camera',
      label: 'Camera / Gear',
      type: 'text',
      placeholder: 'Sony A7 IV, 24-70mm f/2.8...',
    },
    {
      name: 'capturedAt',
      label: 'Captured At',
      type: 'datetime',
      description: 'Date and time of capture',
    },
  ],
  post: [],
  tag: [
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      placeholder: 'Describe the tag taxonomy...',
    },
  ],
};
