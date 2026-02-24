'use client';

import type { PortableTextBlock } from 'next-sanity';
import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { processInstructionText } from '../../utils/instructionProcessor';
import PortableText from '../PortableText/PortableText';

interface Ingredient {
  ingredient: string;
  amount: string;
  unit: string;
  isDiscrete?: boolean;
  notes?: string;
}

interface Instruction {
  title?: string;
  content: PortableTextBlock[];
}

interface RecipeInstructionsProps {
  instructions?: Instruction[];
  ingredients?: Ingredient[];
}

export default function RecipeInstructions({ instructions, ingredients }: RecipeInstructionsProps) {
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

  const processContent = (content: PortableTextBlock[]): PortableTextBlock[] => {
    return content.map(block => {
      if (block._type === 'block' && block.children) {
        const processedChildren = block.children.flatMap(child => {
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

  return (
    <div className='rounded-2xl bg-surface border border-border/30 shadow-lg p-6 md:p-8'>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold font-serif text-foreground mb-2'>Instructions</h2>
        <p className='text-sm text-foreground-muted'>
          Follow these steps to create your recipe. Click each step to mark it as complete.
        </p>
      </div>

      <div className='space-y-8'>
        {instructions.map((instruction, index) => {
          const isCompleted = completedSteps.has(index);

          return (
            <div
              key={index}
              className={`group relative flex gap-6 transition-all duration-300 ${
                isCompleted ? 'opacity-60' : ''
              }`}
            >
              {/* Connecting line */}
              {index < instructions.length - 1 && (
                <div className='absolute left-4 top-12 w-0.5 h-full bg-border/30 -z-10' />
              )}

              <div className='shrink-0'>
                {/* Step Number - Clickable */}
                <button
                  onClick={() => toggleStep(index)}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer shadow-md ${
                    isCompleted
                      ? 'bg-success text-success-contrast scale-95'
                      : 'bg-accent text-accent-contrast hover:bg-accent-hover'
                  }`}
                  aria-label={`Mark step ${index + 1} as ${isCompleted ? 'incomplete' : 'complete'}`}
                >
                  {isCompleted ? <FiCheck className='w-5 h-5' /> : <span>{index + 1}</span>}
                </button>
              </div>

              <div className='flex-1 min-w-0'>
                {instruction.title && (
                  <h3
                    className={`text-xl font-semibold mb-3 transition-all duration-300 ${
                      isCompleted
                        ? 'line-through text-foreground-muted'
                        : 'text-foreground group-hover:text-accent'
                    }`}
                  >
                    {instruction.title}
                  </h3>
                )}
                <div
                  className={`prose prose-gray max-w-none transition-all duration-300 ${
                    isCompleted ? 'line-through' : ''
                  }`}
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
        <div className='mt-10 pt-8 border-t border-border/30'>
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
              onClick={() => setCompletedSteps(new Set())}
              className='px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md bg-surface-hover border border-border/30 text-foreground-subtle hover:text-foreground hover:bg-surface-active'
            >
              Reset
            </button>
          </div>
          <div className='w-full h-2.5 bg-surface-hover/50 rounded-full overflow-hidden'>
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
