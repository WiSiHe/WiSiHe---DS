import type { ConvertedSpacingObject, SpacingToken } from './types';

export function convertSpacingJSON(input: Record<string, SpacingToken>): ConvertedSpacingObject {
  const output: ConvertedSpacingObject = {};

  for (const [componentKey, componentValue] of Object.entries(input)) {
    output[componentKey] = {};

    const regularProps: Record<string, { value: string }> = {};
    const compactProps: Record<string, { value: string }> = {};

    for (const [propKey, propValue] of Object.entries(componentValue)) {
      if (propKey === 'border-radius') {
        output[componentKey][propKey] = { value: propValue.value.replace('{radius', '{border-radius') };
      } else if (propKey.startsWith('regular-')) {
        const newKey = propKey.replace('regular-p', 'padding-');
        regularProps[newKey] = { value: propValue.value };
      } else if (propKey.startsWith('compact-')) {
        const newKey = propKey.replace('compact-p', 'padding-');
        compactProps[newKey] = { value: propValue.value };
      } else {
        output[componentKey][propKey] = { value: propValue.value };
      }
    }

    if (Object.keys(regularProps).length > 0) {
      // @ts-expect-error: regular is not defined in the type but we need to add it dynamically
      output[componentKey].regular = regularProps;
    }
    if (Object.keys(compactProps).length > 0) {
      // @ts-expect-error: compact is not defined in the type but we need to add it dynamically
      output[componentKey].compact = compactProps;
    }
  }

  return output;
}
