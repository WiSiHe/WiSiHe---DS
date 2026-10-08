import { CheckmarkIcon } from '@sanity/icons/Checkmark';
import { CloseIcon } from '@sanity/icons/Close';
import { CopyIcon } from '@sanity/icons/Copy';
import { EditIcon } from '@sanity/icons/Edit';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { SyncIcon } from '@sanity/icons/Sync';
import { WarningOutlineIcon } from '@sanity/icons/WarningOutline';
import { useId, useState } from 'react';
import {
  AVAILABLE_AI_MODELS,
  type CopilotAction,
  type CopilotModel,
  type CopilotPerspective,
  type CopilotTone,
  DEFAULT_AI_MODEL,
  executeCopilotActionDetailed,
} from '../../lib/copilotClient';

interface AIControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  currentText: string;
  onApplyResult: (resultText: string, mode: 'replace' | 'insert-below') => void;
}

interface ActionPreset {
  id: CopilotAction;
  label: string;
  icon: string;
  description: string;
  defaultPrompt?: string;
}

const ACTION_PRESETS: ActionPreset[] = [
  {
    id: 'outline-to-draft',
    label: 'Outline to Draft',
    icon: '✍️',
    description: 'Transform rough notes into fluid, beautifully written paragraphs',
  },
  {
    id: 'generate-subheadings',
    label: 'Generate Subheadings',
    icon: '📑',
    description: 'Structure content with compelling Markdown H2 & H3 headings',
  },
  {
    id: 'tldr',
    label: 'Executive TL;DR',
    icon: '🎯',
    description: 'Extract concise bullet points in a formatted callout block',
  },
  {
    id: 'improve',
    label: 'Elevate & Refine',
    icon: '✨',
    description: 'Polish rhythm, vocabulary, and flow while keeping your voice',
  },
  {
    id: 'critique',
    label: 'Editorial Critique',
    icon: '🧐',
    description: 'Director-level evaluation of pacing, structure, and hook',
  },
  {
    id: 'shorten',
    label: 'Make Concise',
    icon: '✂️',
    description: 'Cut filler and tighten phrasing without losing essential detail',
  },
  {
    id: 'expand',
    label: 'Sensory Expansion',
    icon: '🔍',
    description: 'Elaborate on details, technical context, and atmosphere',
  },
  {
    id: 'accordion-condense',
    label: 'Deep Dive Accordion',
    icon: '🔽',
    description: 'Structure complex details or specs into an interactive collapsible section',
  },
  {
    id: 'translate-no',
    label: 'Norwegian (Bokmål)',
    icon: '🇳🇴',
    description: 'Translate naturally into articulate, literary Norwegian',
  },
];

export function AIControlCenter({
  isOpen,
  onClose,
  documentTitle = 'Untitled Document',
  currentText,
  onApplyResult,
}: AIControlCenterProps) {
  const [selectedAction, setSelectedAction] = useState<CopilotAction>('improve');
  const [selectedModel, setSelectedModel] = useState<CopilotModel>(DEFAULT_AI_MODEL);
  const [usedModel, setUsedModel] = useState<string | null>(null);
  const [tone, setTone] = useState<CopilotTone>('technical');
  const [perspective, setPerspective] = useState<CopilotPerspective>('first-person');
  const [creativity, setCreativity] = useState<number>(0.7);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const creativityId = useId();
  const customPromptId = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeModelMeta =
    AVAILABLE_AI_MODELS.find(m => m.id === selectedModel) || AVAILABLE_AI_MODELS[0];

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await executeCopilotActionDetailed({
        action: selectedAction,
        text: currentText,
        prompt: customPrompt,
        documentTitle,
        tone,
        perspective,
        temperature: creativity,
        model: selectedModel,
      });
      setResult(response.result);
      setUsedModel(response.model);
    } catch (err) {
      console.error('AI Control Center generation failed:', err);
      setError(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = result ? result.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className='ai-modal-overlay'>
      <div className='ai-modal-container'>
        {/* Header */}
        <div className='ai-modal-header'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className='ai-modal-header-icon'>
              <SparklesIcon style={{ fontSize: '1.25rem', color: '#818cf8' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 className='ai-modal-title'>AI Editorial Studio</h2>
                <span
                  className='ai-model-badge'
                  title={`Powered by ${activeModelMeta.provider} ${activeModelMeta.name}`}
                >
                  <span className='ai-model-badge-dot' />
                  {activeModelMeta.badge}
                </span>
              </div>
              <p className='ai-modal-subtitle'>
                Direct tone, voice, pacing, and editorial structure for "{documentTitle}"
              </p>
            </div>
          </div>
          <button
            type='button'
            className='drawer-close-btn'
            onClick={onClose}
            aria-label='Close AI Studio'
          >
            <CloseIcon style={{ fontSize: '1.2rem' }} />
          </button>
        </div>

        {/* Modal Split Content */}
        <div className='ai-modal-body'>
          {/* Left Column: Controls */}
          <div className='ai-controls-column'>
            {/* AI Model Selector */}
            <div className='ai-control-group'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.45rem',
                }}
              >
                <span className='ai-control-label' style={{ margin: 0 }}>
                  AI Intelligence Model
                </span>
                <span className='ai-model-tag-pill'>{activeModelMeta.tag}</span>
              </div>
              <div className='ai-model-grid'>
                {AVAILABLE_AI_MODELS.map(m => (
                  <button
                    key={m.id}
                    type='button'
                    className={`ai-model-select-card ${selectedModel === m.id ? 'active' : ''}`}
                    onClick={() => setSelectedModel(m.id)}
                  >
                    <div className='ai-model-card-top'>
                      <div className={`ai-model-avatar avatar-${m.avatar.variant}`}>
                        <span className='avatar-main-text'>{m.avatar.text}</span>
                        {m.avatar.subtext && (
                          <span className='avatar-sub-text'>{m.avatar.subtext}</span>
                        )}
                      </div>
                      <div className='ai-model-card-info'>
                        <div className='ai-model-card-title-row'>
                          <span className='ai-model-card-title'>{m.name}</span>
                          {selectedModel === m.id && (
                            <span className='ai-model-active-check' title='Selected'>
                              <CheckmarkIcon style={{ fontSize: '0.85rem' }} />
                            </span>
                          )}
                        </div>
                        <span className='ai-model-card-provider'>{m.provider}</span>
                      </div>
                    </div>
                    <span className='ai-model-card-desc'>{m.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className='ai-control-group'>
              <span className='ai-control-label'>Editorial Tone</span>
              <div className='ai-pill-grid'>
                {(
                  [
                    { id: 'technical', label: 'Technical', desc: 'Rigorous & analytical' },
                    { id: 'narrative', label: 'Narrative', desc: 'Evocative & sensory' },
                    { id: 'punchy', label: 'Punchy', desc: 'Fast-paced & crisp' },
                    { id: 'casual', label: 'Casual', desc: 'Conversational & warm' },
                    { id: 'executive', label: 'Executive', desc: 'Strategic summary' },
                  ] as const
                ).map(t => (
                  <button
                    key={t.id}
                    type='button'
                    className={`ai-tone-pill ${tone === t.id ? 'active' : ''}`}
                    onClick={() => setTone(t.id)}
                  >
                    <span className='pill-title'>{t.label}</span>
                    <span className='pill-desc'>{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice & Perspective */}
            <div className='ai-control-group'>
              <span className='ai-control-label'>Author Perspective</span>
              <div className='ai-toggle-pair'>
                <button
                  type='button'
                  className={`ai-toggle-btn ${perspective === 'first-person' ? 'active' : ''}`}
                  onClick={() => setPerspective('first-person')}
                >
                  <span>👤 1st Person (Henrik)</span>
                </button>
                <button
                  type='button'
                  className={`ai-toggle-btn ${perspective === 'third-person' ? 'active' : ''}`}
                  onClick={() => setPerspective('third-person')}
                >
                  <span>🏛️ 3rd Person (Studio)</span>
                </button>
              </div>
            </div>

            {/* Action Presets */}
            <div className='ai-control-group'>
              <span className='ai-control-label'>Editorial Action</span>
              <div className='ai-action-list'>
                {ACTION_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    type='button'
                    className={`ai-action-card ${selectedAction === preset.id ? 'active' : ''}`}
                    onClick={() => setSelectedAction(preset.id)}
                  >
                    <span className='ai-action-icon'>{preset.icon}</span>
                    <div className='ai-action-details'>
                      <span className='ai-action-label'>{preset.label}</span>
                      <span className='ai-action-desc'>{preset.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Creativity Slider */}
            <div className='ai-control-group'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.4rem',
                }}
              >
                <label htmlFor={creativityId} className='ai-control-label' style={{ margin: 0 }}>
                  Creativity (Temperature)
                </label>
                <span className='ai-slider-value'>{creativity.toFixed(1)}</span>
              </div>
              <input
                id={creativityId}
                type='range'
                min='0.2'
                max='0.9'
                step='0.1'
                value={creativity}
                onChange={e => setCreativity(parseFloat(e.target.value))}
                className='ai-slider'
              />
              <div className='ai-slider-labels'>
                <span>Focused (0.2)</span>
                <span>Balanced (0.6)</span>
                <span>Artistic (0.9)</span>
              </div>
            </div>

            {/* Custom Instruction */}
            <div className='ai-control-group'>
              <label htmlFor={customPromptId} className='ai-control-label'>
                Custom Instruction (Optional)
              </label>
              <textarea
                id={customPromptId}
                className='ai-custom-textarea'
                rows={2}
                placeholder='Additional guidelines or specifics (e.g. "Focus on the lighting and shaders in section 2")...'
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
              />
            </div>

            {/* Generate Action Button */}
            <button
              type='button'
              className='btn-generate-ai'
              onClick={() => void handleGenerate()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <SyncIcon className='rotating' style={{ fontSize: '1.1rem' }} />
                  <span>Generating with {activeModelMeta.name}…</span>
                </>
              ) : (
                <>
                  <SparklesIcon style={{ fontSize: '1.1rem', color: '#fff' }} />
                  <span>Run AI Transformation</span>
                </>
              )}
            </button>

            {error && (
              <div className='media-error-banner' style={{ marginTop: '0.75rem' }}>
                <WarningOutlineIcon />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Right Column: Comparison & Results */}
          <div className='ai-result-column'>
            <div className='ai-result-header'>
              <span className='ai-result-title'>
                {result ? `Generated Output (${wordCount} words)` : 'Preview & Output'}
              </span>
              {result && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type='button' className='snippet-btn sm secondary' onClick={handleCopy}>
                    {copied ? (
                      <>
                        <CheckmarkIcon style={{ color: '#10b981' }} /> Copied!
                      </>
                    ) : (
                      <>
                        <CopyIcon /> Copy
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className='ai-result-body'>
              {isLoading ? (
                <div className='ai-result-loading'>
                  <SyncIcon
                    className='rotating'
                    style={{ fontSize: '2rem', color: 'var(--ed-accent)' }}
                  />
                  <p>Synthesizing {tone} transformation…</p>
                </div>
              ) : result ? (
                <div className='ai-result-content'>
                  <pre className='ai-result-markdown'>{result}</pre>
                </div>
              ) : (
                <div className='ai-result-empty'>
                  <div className='ai-empty-hero-icon'>
                    <div className='ai-empty-icon-glow' />
                    <SparklesIcon
                      style={{ fontSize: '2.4rem', color: '#a5b4fc', position: 'relative' }}
                    />
                  </div>
                  <h3 className='ai-empty-title'>AI Editorial Direction</h3>
                  <p className='ai-empty-desc'>
                    Fine-tune tone, perspective, and creativity on the left, or launch a quick
                    editorial preset:
                  </p>
                  <div className='ai-quick-preset-chips'>
                    <button
                      type='button'
                      className='ai-preset-chip'
                      onClick={() => {
                        setSelectedAction('improve');
                        setTone('technical');
                      }}
                    >
                      <span className='chip-emoji'>✨</span>
                      <div className='chip-text'>
                        <strong>Elevate & Refine</strong>
                        <span>Analytical, rigorous polish</span>
                      </div>
                    </button>
                    <button
                      type='button'
                      className='ai-preset-chip'
                      onClick={() => {
                        setSelectedAction('outline-to-draft');
                        setTone('narrative');
                      }}
                    >
                      <span className='chip-emoji'>✍️</span>
                      <div className='chip-text'>
                        <strong>Outline to Draft</strong>
                        <span>Evocative & sensory storytelling</span>
                      </div>
                    </button>
                    <button
                      type='button'
                      className='ai-preset-chip'
                      onClick={() => {
                        setSelectedAction('tldr');
                        setTone('executive');
                      }}
                    >
                      <span className='chip-emoji'>🎯</span>
                      <div className='chip-text'>
                        <strong>Executive TL;DR</strong>
                        <span>Strategic key takeaways</span>
                      </div>
                    </button>
                    <button
                      type='button'
                      className='ai-preset-chip'
                      onClick={() => {
                        setSelectedAction('generate-subheadings');
                        setTone('punchy');
                      }}
                    >
                      <span className='chip-emoji'>📑</span>
                      <div className='chip-text'>
                        <strong>Subheadings</strong>
                        <span>Compelling Markdown H2 & H3</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions when Result is Ready */}
            {result && (
              <div className='ai-result-footer-container'>
                <div className='ai-result-meta-bar'>
                  <div className='ai-result-meta-pill'>
                    <SparklesIcon style={{ fontSize: '0.85rem', color: '#818cf8' }} />
                    <span>
                      Engine: <strong>{usedModel || selectedModel}</strong>
                    </span>
                  </div>
                  <div className='ai-result-meta-pill'>
                    <span>
                      Word Count: <strong>{wordCount}</strong>
                    </span>
                  </div>
                  <div className='ai-result-meta-pill'>
                    <span>
                      Creativity: <strong>{creativity}</strong>
                    </span>
                  </div>
                </div>
                <div className='ai-result-footer'>
                  <button
                    type='button'
                    className='snippet-btn secondary'
                    style={{ flex: 1 }}
                    onClick={() => {
                      onApplyResult(result, 'insert-below');
                      onClose();
                    }}
                  >
                    <EditIcon />
                    <span>Insert Below Cursor</span>
                  </button>
                  <button
                    type='button'
                    className='snippet-btn primary'
                    style={{ flex: 1 }}
                    onClick={() => {
                      onApplyResult(result, 'replace');
                      onClose();
                    }}
                  >
                    <CheckmarkIcon />
                    <span>Apply / Replace Selection</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
