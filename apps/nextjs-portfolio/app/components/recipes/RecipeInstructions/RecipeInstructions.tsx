'use client';

import { IconCheck } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import type { PortableTextBlock } from 'next-sanity';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { processInstructionText } from '../../../utils/instructionProcessor';
import PortableText from '../../cms/PortableText/PortableText';

interface Ingredient {
  ingredient: string;
  amount: string;
  unit: string;
  isDiscrete?: boolean;
  notes?: string;
}

interface Instruction {
  title?: string | null;
  content: PortableTextBlock[] | readonly PortableTextBlock[];
}

interface RecipeInstructionsProps {
  instructions?: Instruction[] | null;
  ingredients?: Ingredient[];
  headerActions?: ReactNode;
}

export default function RecipeInstructions({
  instructions,
  ingredients,
  headerActions,
}: RecipeInstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  if (!instructions || instructions.length === 0) {
    return null;
  }

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
      }
      return newSet;
    });
  };

  const processContent = (
    content: PortableTextBlock[] | readonly PortableTextBlock[],
  ): PortableTextBlock[] => {
    return [...content].map(block => {
      if (block._type === 'block' && block.children) {
        // Merge adjacent plain-text spans (spans without marks) to avoid curly braces being split across spans.
        const mergedChildren: Array<{
          _key?: string;
          _type: string;
          text?: string;
          marks?: string[];
        }> = [];
        for (const child of block.children) {
          const lastChild = mergedChildren[mergedChildren.length - 1];
          if (
            lastChild &&
            lastChild._type === 'span' &&
            (!lastChild.marks || lastChild.marks.length === 0) &&
            child._type === 'span' &&
            (!child.marks || child.marks.length === 0)
          ) {
            lastChild.text = (lastChild.text || '') + (child.text || '');
          } else {
            mergedChildren.push({ ...child });
          }
        }

        const processedChildren = mergedChildren.flatMap(child => {
          if (child._type === 'span' && child.text && typeof child.text === 'string') {
            // Process the text to replace ingredient references
            const processedText = processInstructionText(child.text, ingredients || []);

            // Split by the bold markers we added
            const parts = processedText.split(/(\*\*[^*]+\*\*)/g);
            const processedParts = parts
              .map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  // This is a processed ingredient reference
                  return {
                    _key: `${child._key}-part-${partIndex}`,
                    _type: 'span' as const,
                    text: part.slice(2, -2), // Remove ** markers
                    marks: ['strong'],
                  };
                } else if (part) {
                  // Regular text
                  return {
                    _key: `${child._key}-part-${partIndex}`,
                    _type: 'span' as const,
                    text: part,
                    marks: [],
                  };
                }
                return null;
              })
              .filter((part): part is NonNullable<typeof part> => part !== null);

            return processedParts;
          }
          return [child];
        });

        return {
          ...block,
          children: processedChildren,
        };
      }
      return block;
    });
  };

  // Find the first uncompleted step (active step)
  const activeStepIndex = instructions.findIndex((_, idx) => !completedSteps.has(idx));

  return (
    <div className='w-full space-y-8'>
      <div className='mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-border/10 pb-4'>
        <div>
          <h2 className='text-3xl font-extrabold tracking-tight text-foreground mb-2 font-sans'>
            Instructions
          </h2>
          <p className='text-sm text-foreground-muted'>
            Follow these steps to create your recipe. Click each step to mark it as complete.
          </p>
        </div>
        {headerActions ? <div className='shrink-0'>{headerActions}</div> : null}
      </div>

      <div className='space-y-4'>
        {instructions.map((instruction, index) => {
          const isCompleted = completedSteps.has(index);
          const isActive = index === activeStepIndex;

          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static instruction steps
              key={index}
              className={cn(
                'group relative flex gap-6 transition-all duration-300 px-4 py-6 rounded-3xl border border-transparent',
                isActive && 'bg-accent/5 shadow-xs scale-[1.01]',
                isCompleted && 'opacity-40',
              )}
            >
              {/* Connecting line */}
              {index < instructions.length - 1 && (
                <div className='absolute left-9 top-16 w-0.5 h-full bg-border/10 -z-10' />
              )}

              <div className='shrink-0'>
                {/* Step Number - Clickable */}
                <button
                  type='button'
                  onClick={() => toggleStep(index)}
                  className={cn(
                    'relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer shadow-sm border-2',
                    isCompleted
                      ? 'bg-success border-success text-success-contrast scale-95'
                      : isActive
                        ? 'border-accent bg-accent text-accent-contrast shadow-accent/20 shadow-md ring-2 ring-accent/25'
                        : 'border-border bg-background text-foreground-subtle hover:border-accent hover:text-accent',
                  )}
                  aria-label={`Mark step ${index + 1} as ${isCompleted ? 'incomplete' : 'complete'}`}
                >
                  {isCompleted ? (
                    <IconCheck className='size-5' stroke={2} aria-hidden />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
              </div>

              <div className='flex-1 min-w-0'>
                {instruction.title && (
                  <h3
                    className={cn(
                      'text-xl font-bold mb-2 transition-all duration-300 font-sans tracking-tight',
                      isCompleted
                        ? 'line-through text-foreground-muted'
                        : 'text-foreground group-hover:text-accent',
                    )}
                  >
                    {instruction.title}
                  </h3>
                )}
                <div
                  className={cn(
                    'prose prose-gray max-w-none transition-all duration-300',
                    isCompleted ? 'line-through' : '',
                  )}
                >
                  <div className={isCompleted ? 'text-foreground-muted' : 'text-foreground-subtle'}>
                    <PortableText value={processContent(instruction.content)} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress indicator */}
      {completedSteps.size > 0 && (
        <div className='mt-10 pt-8 border-t border-border/10'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-sm font-medium text-foreground'>
                Progress: {completedSteps.size} of {instructions.length} steps completed
              </p>
              <p className='text-xs text-foreground-muted mt-1'>
                {Math.round((completedSteps.size / instructions.length) * 100)}% complete
              </p>
            </div>
            <button
              type='button'
              onClick={() => setCompletedSteps(new Set())}
              className='px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md bg-surface-hover border border-border/30 text-foreground-subtle hover:text-foreground hover:bg-surface-active'
            >
              Reset
            </button>
          </div>
          <div className='w-full h-2 bg-surface-hover/50 rounded-full overflow-hidden'>
            <div
              className='h-full rounded-full transition-all duration-500 bg-gradient-to-r from-success to-success/80 shadow-sm'
              style={{
                width: `${(completedSteps.size / instructions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
