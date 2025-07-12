'use client';

import PortableText from '../PortableText/PortableText';
import { PortableTextBlock } from 'next-sanity';
import { processInstructionText } from '../../utils/instructionProcessor';
import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

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
        const processedChildren = block.children
          .map(child => {
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
          })
          .flat();

        return {
          ...block,
          children: processedChildren,
        };
      }
      return block;
    });
  };

  return (
    <div
      className="rounded-2xl shadow-lg p-6"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
        Instructions
      </h2>
      <div className="space-y-6">
        {instructions.map((instruction, index) => {
          const isCompleted = completedSteps.has(index);

          return (
            <div
              key={index}
              className={`flex gap-4 transition-all duration-200 ${
                isCompleted ? 'opacity-75' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {/* Step Number - Clickable */}
                <button
                  onClick={() => toggleStep(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                    isCompleted ? 'scale-90' : ''
                  }`}
                  style={{
                    background: isCompleted ? 'var(--color-accent-success)' : 'var(--color-accent)',
                    color: 'var(--color-on-primary)',
                  }}
                  aria-label={`Mark step ${index + 1} as ${isCompleted ? 'incomplete' : 'complete'}`}
                >
                  {isCompleted ? <FiCheck className="w-4 h-4" /> : index + 1}
                </button>
              </div>

              <div
                className={`flex-1 transition-all duration-200 ${
                  isCompleted ? 'line-through' : ''
                }`}
              >
                {instruction.title && (
                  <h3
                    className={`text-lg font-semibold mb-3 transition-all duration-200 ${
                      isCompleted ? 'line-through' : ''
                    }`}
                    style={{
                      color: isCompleted
                        ? 'var(--color-text-tertiary)'
                        : 'var(--color-text-primary)',
                    }}
                  >
                    {instruction.title}
                  </h3>
                )}
                <div
                  className={`prose prose-gray max-w-none transition-all duration-200 ${
                    isCompleted ? 'line-through' : ''
                  }`}
                  style={{
                    color: isCompleted
                      ? 'var(--color-text-tertiary)'
                      : 'var(--color-text-secondary)',
                  }}
                >
                  <PortableText value={processContent(instruction.content)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress indicator */}
      {completedSteps.size > 0 && (
        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--color-text-secondary)' }}>
              Progress: {completedSteps.size} of {instructions.length} steps completed
            </span>
            <button
              onClick={() => setCompletedSteps(new Set())}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 hover:shadow-md"
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              Reset
            </button>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                background: 'var(--color-accent-success)',
                width: `${(completedSteps.size / instructions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
