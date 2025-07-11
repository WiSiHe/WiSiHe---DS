'use client';

import PortableText from '../PortableText/PortableText';
import { PortableTextBlock } from 'next-sanity';
import { processInstructionText } from '../../utils/instructionProcessor';

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
  if (!instructions || instructions.length === 0) {
    return null;
  }

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
        {instructions.map((instruction, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                }}
              >
                {index + 1}
              </div>
            </div>
            <div className="flex-1">
              {instruction.title && (
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {instruction.title}
                </h3>
              )}
              <div
                className="prose prose-gray max-w-none"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <PortableText value={processContent(instruction.content)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
