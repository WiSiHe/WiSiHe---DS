import type { LocalVariable, LocalVariableCollection } from '@figma/rest-api-spec';

// Define the list of brands
export const BRANDS = [
  'neutral',
  'tine',
  'fjordland-base',
  'diplom-is',
  'leverant',
  'skolelyst',
  'fjordland',
  'yoplait',
  'safari',
  'brelett',
  'kos',
  'isdalen',
];
export const FJORDLAND_SUB_BRANDS = ['fjordland-base', 'brelett', 'kos', 'safari', 'yoplait'];
export const SEMANTIC_KEYS = ['background', 'button', 'ink', 'link', 'surface'];

export type Brand = (typeof BRANDS)[number];

// Token structures
export interface TokenInfo {
  type: string;
  value: string | number | boolean;
  comment: string;
}

export type BrandTokens = Record<
  string,
  {
    color: Record<string, TokenInfo | Record<string, TokenInfo>>;
    spacing: Record<string, TokenInfo | Record<string, TokenInfo>>;
  }
>;

export interface SpacingToken {
  comment: string;
  type: string;
  value: string;
}

export interface ConvertedSpacingToken {
  value: string;
}

export type ConvertedSpacingObject = Record<string, ConvertedSpacingToken | Record<string, ConvertedSpacingToken>>;

export interface InputToken {
  value: string;
  type?: string;
  comment?: string;
}

export interface OutputToken {
  value: string;
  comment?: string;
}

export type InputJSON = Record<string, Record<string, InputToken>>;

export type OutputJSON = Record<string, Record<string, OutputToken | Record<string, OutputToken>>>;

export interface FigmaVariables {
  localVariableCollections: Record<string, LocalVariableCollection>;
  localVariables: Record<string, LocalVariable>;
}
