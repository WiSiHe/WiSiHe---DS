import { AddIcon } from '@sanity/icons/Add';
import { CaseIcon } from '@sanity/icons/Case';
import { CheckmarkIcon } from '@sanity/icons/Checkmark';
import { CloseIcon } from '@sanity/icons/Close';
import { ComponentIcon } from '@sanity/icons/Component';
import { CopyIcon } from '@sanity/icons/Copy';
import { DocumentIcon } from '@sanity/icons/Document';
import { ImagesIcon } from '@sanity/icons/Images';
import { SearchIcon } from '@sanity/icons/Search';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { SyncIcon } from '@sanity/icons/Sync';
import { TagIcon } from '@sanity/icons/Tag';
import { TrashIcon } from '@sanity/icons/Trash';
import { UploadIcon } from '@sanity/icons/Upload';
import { useClient, useQuery } from '@sanity/sdk-react';
import { useEffect, useId, useMemo, useState } from 'react';
import { executeCopilotAction, uploadImageToSanity } from '../../lib/copilotClient';

export interface SanityImageAsset {
  _id: string;
  url: string;
  originalFilename?: string;
  size?: number;
  metadata?: {
    dimensions?: {
      width: number;
      height: number;
      aspectRatio: number;
    };
    lqip?: string;
  };
}

export interface SnippetTemplate {
  id: string;
  title: string;
  category: 'Callouts' | 'Structure' | 'Media' | 'CTA';
  description: string;
  iconName?: string;
  content: string;
}

export const BUILTIN_TEMPLATES: SnippetTemplate[] = [
  {
    id: 'callout-info',
    title: 'Info Callout',
    category: 'Callouts',
    description: 'Highlighted informational note for context or background.',
    content: `> 💡 **Note**\n> Add detailed context or background considerations here.`,
  },
  {
    id: 'callout-tip',
    title: 'Pro Tip',
    category: 'Callouts',
    description: 'Actionable recommendation, workflow tip, or best practice.',
    content: `> 🚀 **Pro Tip**\n> Share a high-impact technical shortcut or design technique.`,
  },
  {
    id: 'callout-warning',
    title: 'Warning Notice',
    category: 'Callouts',
    description: 'Cautionary note highlighting constraints, breaking changes, or pitfalls.',
    content: `> ⚠️ **Caution**\n> Note any critical constraints, deprecations, or edge cases to watch out for.`,
  },
  {
    id: 'tldr-summary',
    title: 'TL;DR Executive Summary',
    category: 'Structure',
    description: 'Clean executive summary block with high-level bullet points.',
    content: `> 📌 **TL;DR**\n> - **Concept:** Core objective or narrative premise in one sentence.\n> - **Role & Stack:** Primary responsibilities and technologies used.\n> - **Outcome:** Key deliverables, performance results, or current status.`,
  },
  {
    id: 'specs-grid',
    title: 'Project Specifications',
    category: 'Structure',
    description: 'Structured metadata specification list for case studies.',
    content: `### Project Specifications\n- **Client / Context:** Client or Event Name\n- **Role:** Lead Developer & Technical Artist\n- **Tech Stack:** Unreal Engine 5, Next.js, Sanity, TypeScript\n- **Timeline:** 2024 – Present\n- **Status:** Active Development`,
  },
  {
    id: 'mermaid-diagram',
    title: 'Mermaid Architecture Diagram',
    category: 'Media',
    description: 'Flowchart architecture diagram rendered via Mermaid.',
    content: `\`\`\`mermaid\ngraph TD\n  A[Content Author in WiSiHe AI] -->|Publishes Draft| B(Sanity Content Lake)\n  B -->|Draft Mode & Webhooks| C[Next.js Portfolio]\n  C -->|Fluid UI| D((Global Readers))\n\`\`\``,
  },
  {
    id: 'video-embed',
    title: 'Video Walkthrough Block',
    category: 'Media',
    description: 'Standard video player link block for gameplay or demos.',
    content: `> 🎥 **Video Demo & Walkthrough**\n> Watch the high-resolution playthrough on YouTube: [Watch Video](https://www.youtube.com)\n> *Duration: ~3 mins • Recorded in 4K 60fps*`,
  },
  {
    id: 'divider',
    title: 'Section Divider',
    category: 'Structure',
    description: 'A clean thematic break line separating major sections.',
    content: `\n---\n`,
  },
  {
    id: 'cta-collaboration',
    title: 'Collaboration CTA',
    category: 'CTA',
    description: 'Inviting banner encouraging readers to reach out or explore more.',
    content: `> 🤝 **Interested in collaborating?**\n> Have questions about the pipeline, architecture, or custom commission work? Feel free to [explore more projects](/projects) or [get in touch](/about).`,
  },
];

interface SanityReferenceItem {
  _id: string;
  _type: 'project' | 'post' | 'painting' | 'tag';
  title?: string;
  name?: string;
  slug?: { current?: string };
}

interface ReusableContentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertContent: (text: string) => void;
  initialTab?: 'blocks' | 'sanity' | 'media' | 'custom';
  documentTitle?: string;
}

export function ReusableContentDrawer({
  isOpen,
  onClose,
  onInsertContent,
  initialTab = 'blocks',
  documentTitle,
}: ReusableContentDrawerProps) {
  const [activeTab, setActiveTab] = useState<'blocks' | 'sanity' | 'media' | 'custom'>(initialTab);
  const altInputId = useId();
  const captionInputId = useId();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const _client = useClient({ apiVersion: '2025-02-19' });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<SanityImageAsset | null>(null);
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [isGeneratingAiAlt, setIsGeneratingAiAlt] = useState(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Custom snippets in localStorage
  const [customSnippets, setCustomSnippets] = useState<
    Array<{ id: string; title: string; content: string }>
  >(() => {
    try {
      const stored = localStorage.getItem('wisihe_saved_snippets');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Fetch live Sanity documents for cross-referencing
  const { data: sanityItems } = useQuery<SanityReferenceItem[]>({
    query: `*[_type in ["project", "post", "painting", "tag"] && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0...100] {
      _id,
      _type,
      title,
      name,
      slug
    }`,
  });

  // Fetch live Sanity image assets
  const { data: sanityImages, isPending: isImagesLoading } = useQuery<SanityImageAsset[]>({
    query: `*[_type == "sanity.imageAsset"] | order(_createdAt desc)[0...60] {
      _id,
      url,
      originalFilename,
      size,
      metadata {
        dimensions { width, height, aspectRatio },
        lqip
      }
    }`,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const asset = await uploadImageToSanity(file);
      const imgAsset = asset as unknown as SanityImageAsset;
      setSelectedImage(imgAsset);
      setImageAlt(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      setImageCaption('');
    } catch (err) {
      console.error('Failed to upload image to Sanity:', err);
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleGenerateAiAlt = async () => {
    if (!selectedImage) return;
    setIsGeneratingAiAlt(true);
    try {
      const result = await executeCopilotAction({
        action: 'generate-alt',
        text: `Image filename: ${selectedImage.originalFilename || 'image'}. Document title: ${documentTitle || 'Portfolio work'}`,
        documentTitle,
      });
      if (result) {
        const altMatch = result.match(/Alt:\s*(.*)/i);
        const captionMatch = result.match(/Caption:\s*(.*)/i);
        if (altMatch?.[1]) {
          setImageAlt(altMatch[1].trim());
        }
        if (captionMatch?.[1]) {
          setImageCaption(captionMatch[1].trim());
        }
        if (!altMatch && !captionMatch) {
          setImageAlt(result.slice(0, 120));
        }
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'AI alt generation failed');
    } finally {
      setIsGeneratingAiAlt(false);
    }
  };

  const handleInsertSelectedImage = () => {
    if (!selectedImage) return;
    const alt = imageAlt.trim() || selectedImage.originalFilename || 'Image';
    const caption = imageCaption.trim();
    const markdown = caption
      ? `![${alt}](${selectedImage.url} "${caption}")`
      : `![${alt}](${selectedImage.url})`;
    onInsertContent(markdown);
    setSelectedImage(null);
    setImageAlt('');
    setImageCaption('');
    onClose();
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSaveCustomSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    const newItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
    };
    const next = [newItem, ...customSnippets];
    setCustomSnippets(next);
    localStorage.setItem('wisihe_saved_snippets', JSON.stringify(next));
    setNewTitle('');
    setNewContent('');
    setIsAddingCustom(false);
  };

  const handleDeleteCustomSnippet = (id: string) => {
    const next = customSnippets.filter(s => s.id !== id);
    setCustomSnippets(next);
    localStorage.setItem('wisihe_saved_snippets', JSON.stringify(next));
  };

  // Filtered built-in blocks
  const filteredBlocks = useMemo(() => {
    if (!searchQuery.trim()) return BUILTIN_TEMPLATES;
    const q = searchQuery.toLowerCase();
    return BUILTIN_TEMPLATES.filter(
      t =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  // Filtered Sanity references
  const filteredSanityItems = useMemo(() => {
    const items = sanityItems ?? [];
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(i => {
      const name = (i.title || i.name || '').toLowerCase();
      const type = i._type.toLowerCase();
      return name.includes(q) || type.includes(q);
    });
  }, [sanityItems, searchQuery]);

  // Filtered Sanity images
  const filteredImages = useMemo(() => {
    const images = sanityImages ?? [];
    if (!searchQuery.trim()) return images;
    const q = searchQuery.toLowerCase();
    return images.filter(img => (img.originalFilename || '').toLowerCase().includes(q));
  }, [sanityImages, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className='reusable-drawer-overlay'>
      <div className='reusable-drawer'>
        {/* Drawer Header */}
        <div className='drawer-header'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className='drawer-header-icon'>
              <ComponentIcon style={{ fontSize: '1.2rem', color: '#818cf8' }} />
            </div>
            <div>
              <h2 className='drawer-title'>Reusable Content</h2>
              <p className='drawer-subtitle'>
                Insert standard blocks, images, snippets & cross-references
              </p>
            </div>
          </div>
          <button
            type='button'
            className='drawer-close-btn'
            onClick={onClose}
            aria-label='Close drawer'
          >
            <CloseIcon style={{ fontSize: '1.1rem' }} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className='drawer-tabs'>
          <button
            type='button'
            className={`drawer-tab ${activeTab === 'blocks' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('blocks');
              setSelectedImage(null);
            }}
          >
            <ComponentIcon />
            <span>Blocks</span>
          </button>
          <button
            type='button'
            className={`drawer-tab ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <ImagesIcon />
            <span>Media & Images</span>
          </button>
          <button
            type='button'
            className={`drawer-tab ${activeTab === 'sanity' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('sanity');
              setSelectedImage(null);
            }}
          >
            <DocumentIcon />
            <span>Cross-References</span>
          </button>
          <button
            type='button'
            className={`drawer-tab ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('custom');
              setSelectedImage(null);
            }}
          >
            <SparklesIcon />
            <span>Saved Snippets</span>
          </button>
        </div>

        {/* Search Filter */}
        <div className='drawer-search-box'>
          <SearchIcon className='drawer-search-icon' />
          <input
            type='text'
            className='drawer-search-input'
            placeholder={`Search ${
              activeTab === 'blocks'
                ? 'blocks'
                : activeTab === 'media'
                  ? 'image filenames'
                  : activeTab === 'sanity'
                    ? 'projects, posts, tags'
                    : 'custom snippets'
            }...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type='button'
              className='drawer-search-clear'
              onClick={() => setSearchQuery('')}
            >
              <CloseIcon style={{ fontSize: '0.9rem' }} />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className='drawer-body'>
          {/* 1. BLOCKS TAB */}
          {activeTab === 'blocks' && (
            <div className='snippet-grid'>
              {filteredBlocks.map(template => (
                <div key={template.id} className='snippet-card'>
                  <div className='snippet-card-header'>
                    <div>
                      <span className='snippet-category-pill'>{template.category}</span>
                      <h3 className='snippet-card-title'>{template.title}</h3>
                    </div>
                  </div>
                  <p className='snippet-card-desc'>{template.description}</p>
                  <div className='snippet-preview-box'>
                    <pre>{template.content.slice(0, 140)}...</pre>
                  </div>
                  <div className='snippet-card-actions'>
                    <button
                      type='button'
                      className='snippet-btn primary'
                      onClick={() => onInsertContent(template.content)}
                    >
                      <AddIcon />
                      <span>Insert</span>
                    </button>
                    <button
                      type='button'
                      className='snippet-btn secondary'
                      onClick={() => copyToClipboard(template.id, template.content)}
                    >
                      {copiedId === template.id ? (
                        <>
                          <CheckmarkIcon style={{ color: '#10b981' }} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. MEDIA & IMAGES TAB */}
          {activeTab === 'media' && (
            <div className='media-tab-container'>
              {/* Upload Dropzone */}
              <div className='media-upload-card'>
                <label className='media-dropzone-label'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={e => void handleFileUpload(e)}
                    style={{ display: 'none' }}
                    disabled={isUploading}
                  />
                  <div className='media-dropzone-content'>
                    {isUploading ? (
                      <>
                        <SyncIcon
                          className='rotating'
                          style={{ fontSize: '1.5rem', color: 'var(--ed-accent)' }}
                        />
                        <span className='media-dropzone-title'>
                          Uploading to Sanity Content Lake…
                        </span>
                        <span className='media-dropzone-hint'>
                          Extracting metadata & dimensions
                        </span>
                      </>
                    ) : (
                      <>
                        <UploadIcon style={{ fontSize: '1.5rem', color: 'var(--ed-accent)' }} />
                        <span className='media-dropzone-title'>Upload Image to Sanity</span>
                        <span className='media-dropzone-hint'>
                          PNG, JPG, WebP, SVG, GIF (Drag or click)
                        </span>
                      </>
                    )}
                  </div>
                </label>
                {uploadError && (
                  <div className='media-error-banner'>
                    <span>⚠️ {uploadError}</span>
                  </div>
                )}
              </div>

              {/* Selected Image Configuration Panel */}
              {selectedImage && (
                <div className='media-selected-panel'>
                  <div className='media-selected-header'>
                    <span className='media-selected-badge'>Selected Image</span>
                    <button
                      type='button'
                      className='drawer-search-clear'
                      onClick={() => setSelectedImage(null)}
                      title='Deselect'
                    >
                      <CloseIcon style={{ fontSize: '0.85rem' }} />
                    </button>
                  </div>

                  <div className='media-selected-body'>
                    <div className='media-preview-box'>
                      <img
                        src={selectedImage.url}
                        alt={imageAlt || 'Preview'}
                        className='media-preview-img'
                      />
                      <div className='media-preview-meta'>
                        <span>{selectedImage.originalFilename || 'Image asset'}</span>
                        {selectedImage.metadata?.dimensions && (
                          <span>
                            {selectedImage.metadata.dimensions.width} ×{' '}
                            {selectedImage.metadata.dimensions.height}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='media-form-group'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.3rem',
                        }}
                      >
                        <label htmlFor={altInputId} className='media-input-label'>
                          Alt Text (SEO & A11y)
                        </label>
                        <button
                          type='button'
                          className='btn-ai-alt'
                          onClick={() => void handleGenerateAiAlt()}
                          disabled={isGeneratingAiAlt}
                        >
                          {isGeneratingAiAlt ? (
                            <>
                              <SyncIcon className='rotating' style={{ fontSize: '0.8rem' }} />
                              <span>Generating…</span>
                            </>
                          ) : (
                            <>
                              <SparklesIcon style={{ fontSize: '0.8rem', color: '#818cf8' }} />
                              <span>✨ AI Suggest</span>
                            </>
                          )}
                        </button>
                      </div>
                      <input
                        id={altInputId}
                        type='text'
                        className='custom-snippet-input'
                        placeholder='Describe the image for screen readers...'
                        value={imageAlt}
                        onChange={e => setImageAlt(e.target.value)}
                      />
                    </div>

                    <div className='media-form-group'>
                      <label htmlFor={captionInputId} className='media-input-label'>
                        Caption (Optional)
                      </label>
                      <input
                        id={captionInputId}
                        type='text'
                        className='custom-snippet-input'
                        placeholder='Add an editorial caption displayed below the image...'
                        value={imageCaption}
                        onChange={e => setImageCaption(e.target.value)}
                      />
                    </div>

                    <div className='media-action-row'>
                      <button
                        type='button'
                        className='snippet-btn primary'
                        style={{ flex: 1 }}
                        onClick={handleInsertSelectedImage}
                      >
                        <AddIcon />
                        <span>Insert Image into Document</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sanity Asset Grid */}
              <div className='media-gallery-section'>
                <div className='media-gallery-header'>
                  <span className='media-gallery-title'>
                    Sanity Asset Library ({filteredImages.length})
                  </span>
                  {isImagesLoading && (
                    <SyncIcon
                      className='rotating'
                      style={{ fontSize: '0.9rem', color: '#818cf8' }}
                    />
                  )}
                </div>

                {filteredImages.length === 0 ? (
                  <div className='drawer-empty'>
                    {isImagesLoading
                      ? 'Loading images from Sanity…'
                      : 'No images found. Upload your first image above.'}
                  </div>
                ) : (
                  <div className='media-asset-grid'>
                    {filteredImages.map(image => {
                      const isChosen = selectedImage?._id === image._id;
                      const dims = image.metadata?.dimensions;
                      const sizeKb = image.size ? `${Math.round(image.size / 1024)} KB` : '';
                      const selectImage = () => {
                        setSelectedImage(image);
                        setImageAlt(
                          image.originalFilename?.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') ||
                            'Image',
                        );
                      };

                      return (
                        <button
                          key={image._id}
                          type='button'
                          className={`media-asset-card ${isChosen ? 'active' : ''}`}
                          onClick={selectImage}
                        >
                          <div className='media-asset-thumb-wrap'>
                            <img
                              src={`${image.url}?w=240&h=180&fit=crop&auto=format`}
                              alt={image.originalFilename || 'Asset'}
                              loading='lazy'
                              className='media-asset-thumb'
                            />
                            {dims && (
                              <span className='media-asset-badge'>
                                {dims.width}×{dims.height}
                              </span>
                            )}
                          </div>
                          <div className='media-asset-info'>
                            <span className='media-asset-filename' title={image.originalFilename}>
                              {image.originalFilename || 'Untitled asset'}
                            </span>
                            {sizeKb && <span className='media-asset-size'>{sizeKb}</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. SANITY CROSS-REFERENCES TAB */}
          {activeTab === 'sanity' && (
            <div className='reference-list'>
              {filteredSanityItems.length === 0 ? (
                <div className='drawer-empty'>No matching documents found in Sanity.</div>
              ) : (
                filteredSanityItems.map(item => {
                  const title = item.title || item.name || 'Untitled';
                  const slug = item.slug?.current || '';
                  const path =
                    item._type === 'project'
                      ? `/projects/${slug}`
                      : item._type === 'painting'
                        ? `/art/${slug}`
                        : item._type === 'tag'
                          ? `/tags/${slug}`
                          : `/posts/${slug}`;

                  const linkMarkdown = `[${title}](${path})`;
                  const cardMarkdown = `> 🔗 **Related ${item._type.toUpperCase()}**: [${title}](${path})\n> *Explore the case study and full documentation.*`;

                  const TypeIcon =
                    item._type === 'project'
                      ? CaseIcon
                      : item._type === 'painting'
                        ? ImagesIcon
                        : item._type === 'tag'
                          ? TagIcon
                          : DocumentIcon;

                  return (
                    <div key={item._id} className='reference-item'>
                      <div className='reference-icon'>
                        <TypeIcon style={{ fontSize: '1.1rem', color: '#a5b4fc' }} />
                      </div>
                      <div className='reference-info'>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className='reference-type-badge'>{item._type}</span>
                          <h4 className='reference-title'>{title}</h4>
                        </div>
                        <span className='reference-path mono'>{path}</span>
                      </div>
                      <div className='reference-actions'>
                        <button
                          type='button'
                          className='snippet-btn sm primary'
                          title='Insert inline link'
                          onClick={() => onInsertContent(linkMarkdown)}
                        >
                          <AddIcon /> Link
                        </button>
                        <button
                          type='button'
                          className='snippet-btn sm secondary'
                          title='Insert reference card'
                          onClick={() => onInsertContent(cardMarkdown)}
                        >
                          <ComponentIcon /> Card
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 3. CUSTOM SNIPPETS TAB */}
          {activeTab === 'custom' && (
            <div>
              {!isAddingCustom ? (
                <button
                  type='button'
                  className='add-custom-snippet-trigger'
                  onClick={() => setIsAddingCustom(true)}
                >
                  <AddIcon /> Create New Custom Snippet
                </button>
              ) : (
                <form className='custom-snippet-form' onSubmit={handleSaveCustomSnippet}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ed-text)' }}>
                    New Saved Snippet
                  </h4>
                  <input
                    type='text'
                    className='custom-snippet-input'
                    placeholder='Snippet Title (e.g. Author Bio, Licensing Note)'
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                  />
                  <textarea
                    className='custom-snippet-textarea'
                    rows={4}
                    placeholder='Markdown or text content...'
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    required
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      type='button'
                      className='snippet-btn secondary'
                      onClick={() => setIsAddingCustom(false)}
                    >
                      Cancel
                    </button>
                    <button type='submit' className='snippet-btn primary'>
                      <CheckmarkIcon /> Save Snippet
                    </button>
                  </div>
                </form>
              )}

              <div className='snippet-grid' style={{ marginTop: '1rem' }}>
                {customSnippets.length === 0 ? (
                  <div className='drawer-empty'>
                    No custom snippets saved yet. Click above to save frequently used intros, bios,
                    or disclaimers.
                  </div>
                ) : (
                  customSnippets.map(snippet => (
                    <div key={snippet.id} className='snippet-card'>
                      <div className='snippet-card-header'>
                        <h3 className='snippet-card-title'>{snippet.title}</h3>
                        <button
                          type='button'
                          className='drawer-delete-btn'
                          onClick={() => handleDeleteCustomSnippet(snippet.id)}
                          title='Delete snippet'
                        >
                          <TrashIcon style={{ fontSize: '0.95rem' }} />
                        </button>
                      </div>
                      <div className='snippet-preview-box'>
                        <pre>{snippet.content}</pre>
                      </div>
                      <div className='snippet-card-actions'>
                        <button
                          type='button'
                          className='snippet-btn primary'
                          onClick={() => onInsertContent(snippet.content)}
                        >
                          <AddIcon />
                          <span>Insert</span>
                        </button>
                        <button
                          type='button'
                          className='snippet-btn secondary'
                          onClick={() => copyToClipboard(snippet.id, snippet.content)}
                        >
                          {copiedId === snippet.id ? (
                            <>
                              <CheckmarkIcon style={{ color: '#10b981' }} />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <CopyIcon />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
