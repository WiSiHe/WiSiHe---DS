import type { LocalVariable } from '@figma/rest-api-spec';
import {
  FJORDLAND_SUB_BRANDS,
  SEMANTIC_KEYS,
  type BrandTokens,
  type InputJSON,
  type OutputJSON,
  type OutputToken,
  type TokenInfo,
} from './types';
import { rgbToHex } from './color';

/**
 * Converts a string to hyphenated lowercase.
 *
 * This function takes a string, converts it to lowercase, and replaces all whitespace characters with hyphens.
 *
 * @param str - The input string.
 * @returns The hyphenated lowercase string.
 */
export function toHyphenatedLowercase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Determines the token type from a LocalVariable.
 *
 * This function takes a LocalVariable and returns a string representing its type based on the resolvedType property.
 *
 * @param variable - The LocalVariable object.
 * @returns The token type as a string.
 */
export function tokenTypeFromVariable(variable: LocalVariable): string {
  switch (variable.resolvedType) {
    case 'BOOLEAN':
      return 'boolean';
    case 'COLOR':
      return 'color';
    case 'FLOAT':
      return 'number';
    case 'STRING':
      return 'string';
    default:
      return 'unknown';
  }
}

/**
 * Extracts the token value from a LocalVariable for a given mode.
 *
 * This function takes a LocalVariable and a modeId, and returns the corresponding token value. If the value is an RGB object,
 * it converts it to a hexadecimal color string.
 *
 * @param variable - The LocalVariable object.
 * @param modeId - The mode identifier.
 * @returns The token value, which can be a string, number, or boolean.
 * @throws Will throw an error if the format of the variable value is invalid.
 */
export function tokenValueFromVariable(variable: LocalVariable, modeId: string): string | number | boolean {
  const value = variable.valuesByMode[modeId];
  if (typeof value === 'object') {
    if ('r' in value) {
      return rgbToHex(value);
    }
    throw new Error(`Format of variable value is invalid: ${JSON.stringify(value)}`);
  }
  return value;
}

/**
 * Processes a LocalVariable and adds it to the brand tokens.
 *
 * This function takes brand tokens, a brand name, a LocalVariable, and a modeId. It creates a TokenInfo object and adds it
 * to the appropriate section (color or spacing) of the brand tokens.
 *
 * @param brandTokens - The BrandTokens object.
 * @param brand - The brand name.
 * @param variable - The LocalVariable object.
 * @param modeId - The mode identifier.
 */
export function processToken(brandTokens: BrandTokens, brand: string, variable: LocalVariable, modeId: string): void {
  const token: TokenInfo = {
    type: tokenTypeFromVariable(variable),
    value: tokenValueFromVariable(variable, modeId),
    comment: variable.description || '',
  };

  const isSpacing = variable.name.toLowerCase().includes('spacing');
  const targetObject = isSpacing ? brandTokens[brand].spacing : brandTokens[brand].color;

  let currentObj: Record<string, any> = targetObject;
  const parts = variable.name.split('/');
  parts.forEach((part, index) => {
    const key = toHyphenatedLowercase(part);
    if (index === parts.length - 1) {
      currentObj[key] = token;
    } else {
      currentObj[key] = currentObj[key] || {};
      currentObj = currentObj[key];
    }
  });
}

/**
 * Transforms an input JSON object into an output JSON object with specific formatting rules.
 *
 * This function takes an InputJSON object and transforms it into an OutputJSON object. It processes each section and token,
 * applying special handling for the 'button' and 'ink' sections.
 *
 * @param input - The input JSON object.
 * @returns The transformed output JSON object.
 */
export function transformJSON(input: InputJSON): OutputJSON {
  const output: OutputJSON = {};

  for (const [sectionKey, sectionValue] of Object.entries(input)) {
    output[sectionKey] = {};

    for (const [tokenKey, tokenValue] of Object.entries(sectionValue)) {
      output[sectionKey][tokenKey] = {
        value: tokenValue.value,
        comment: tokenValue.comment,
        ...(tokenValue.type && { type: tokenValue.type }),
      };
    }
  }

  // Special handling for 'button' section
  const buttonTypes = ['primary', 'secondary', 'tertiary', 'danger', 'disabled'];
  const newButtonSection: OutputJSON['button'] = {};

  for (const buttonType of buttonTypes) {
    newButtonSection[buttonType] = {};
    for (const [key, value] of Object.entries(output.button)) {
      if (key.startsWith(`${buttonType}-`)) {
        const newKey = key.replace(`${buttonType}-`, '');
        (newButtonSection[buttonType] as { [key: string]: OutputToken })[newKey] = value as OutputToken;
        delete output.button[key];
      }
    }
  }

  output.button = { ...output.button, ...newButtonSection };

  // Special handling for 'ink' section
  output.ink.border = {
    default: output.ink['border-default'] as OutputToken,
    subtle: output.ink['border-subtle'] as OutputToken,
  };
  delete output.ink['border-default'];
  delete output.ink['border-subtle'];

  return output;
}

/**
 * Copies Fjordland base colors to its sub-brands.
 *
 * This function checks if the 'Fjordland' brand exists in the brand tokens. If it does, it retrieves the base colors of Fjordland
 * and copies these colors to the specified sub-brands, excluding semantic color tokens.
 *
 * @param brandTokens - The BrandTokens object containing all brand and sub-brand tokens.
 */
export function addFjordlandColorsToSubbrands(brandTokens: BrandTokens): void {
  if (!('fjordland' in brandTokens && 'color' in brandTokens['fjordland'])) {
    console.warn('Fjordland brand or color tokens not found');
    return;
  }

  const fjordlandBaseColor = brandTokens['fjordland']['color'];
  const fjordlandBaseColorKeys = Object.keys(fjordlandBaseColor).filter(key => !SEMANTIC_KEYS.includes(key));

  FJORDLAND_SUB_BRANDS.forEach(subBrand => {
    if (subBrand in brandTokens && 'color' in brandTokens[subBrand]) {
      const subBrandColor = brandTokens[subBrand]['color'];
      fjordlandBaseColorKeys.forEach(key => {
        subBrandColor[key] = fjordlandBaseColor[key];
      });
    } else {
      console.warn(`Sub-brand ${subBrand} or its color tokens not found`);
    }
  });
}

/**
 * Sets a value on an object at a specified path.
 *
 * This function takes an object, a dot-separated path string, and a value. It traverses the object according to the path,
 * creating nested objects as needed, and sets the value at the specified path.
 *
 * @param obj - The object on which to set the value.
 * @param path - The dot-separated path string indicating where to set the value.
 * @param value - The value to set at the specified path.
 */
export function set(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}
