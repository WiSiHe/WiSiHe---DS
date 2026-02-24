/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StructureBuilder } from 'sanity/structure';

// Type definitions for better type safety
interface DocumentItem {
  title: string;
  icon: string;
  schemaType: string;
  documentId?: string; // For singletons
}

interface CategoryItem {
  title: string;
  icon: string;
  items: DocumentItem[];
}

// Configuration data
const singletons: DocumentItem[] = [
  { title: 'Home Page', icon: '🏠', schemaType: 'home', documentId: 'home' },
  { title: 'Site Settings', icon: '🔧', schemaType: 'settings', documentId: 'settings' },
];

const categories: CategoryItem[] = [
  {
    title: 'Art & Creative',
    icon: '🎨',
    items: [
      { title: 'Paintings', icon: '🖼️', schemaType: 'painting' },
      { title: 'Projects', icon: '📁', schemaType: 'project' },
      { title: 'Videos', icon: '🎥', schemaType: 'video' },
    ],
  },
  {
    title: 'Content',
    icon: '📝',
    items: [{ title: 'Recipes', icon: '🍳', schemaType: 'recipe' }],
  },
  {
    title: 'Presentations',
    icon: '📊',
    items: [
      { title: 'Presentations', icon: '📊', schemaType: 'presentation' },
      { title: 'Categories', icon: '🏷️', schemaType: 'presentationCategory' },
    ],
  },
  {
    title: 'Management',
    icon: '🏷️',
    items: [{ title: 'Tags', icon: '🏷️', schemaType: 'tag' }],
  },
];

// Helper functions
const createSingletonItem = (S: StructureBuilder, item: DocumentItem) =>
  S.listItem()
    .title(item.title)
    .icon(() => item.icon)
    .child(S.document().schemaType(item.schemaType).documentId(item.documentId!));

const createDocumentListItem = (S: StructureBuilder, item: DocumentItem) =>
  S.listItem()
    .title(item.title)
    .icon(() => item.icon)
    .child(
      S.documentTypeList(item.schemaType).title(item.title).filter(`_type == "${item.schemaType}"`),
    );

const createCategoryItem = (S: StructureBuilder, category: CategoryItem) =>
  S.listItem()
    .title(category.title)
    .icon(() => category.icon)
    .child(
      S.list()
        .title(category.title)
        .items(category.items.map(item => createDocumentListItem(S, item))),
    );

// All schema types that are handled explicitly (for the "Other Documents" filter)
const handledSchemaTypes = [
  'home',
  'settings',
  ...categories.flatMap(cat => cat.items.map(item => item.schemaType)),
];

// Main structure builder
export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Site Configuration section
      S.listItem()
        .title('Site Configuration')
        .icon(() => '⚙️')
        .child(
          S.list()
            .title('Site Configuration')
            .items(singletons.map(item => createSingletonItem(S, item))),
        ),

      S.divider(),

      // Dynamic categories
      ...categories.map(category => createCategoryItem(S, category)),

      S.divider(),

      // Other Documents (fallback)
      S.listItem()
        .title('Other Documents')
        .icon(() => '📄')
        .child(
          S.list()
            .title('Other Documents')
            .items(
              (S.documentTypeListItems() as any[]).filter(
                (listItem: any) => !handledSchemaTypes.includes(listItem.getId() as string),
              ),
            ),
        ),
    ]);
