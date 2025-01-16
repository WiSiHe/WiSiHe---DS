import * as path from 'node:path';
import * as fs from 'node:fs';
import type { GetLocalVariablesResponse, LocalVariable, LocalVariableCollection } from '@figma/rest-api-spec';
import type { BrandTokens, InputJSON, TokenInfo } from './utils/types';
import { BRANDS } from './utils/types';
import { convertSpacingJSON } from './utils/spacing';
import {
  addFjordlandColorsToSubbrands,
  processToken,
  set,
  toHyphenatedLowercase,
  tokenTypeFromVariable,
  transformJSON,
} from './utils/token';
import { getBrandFromCollectionName } from './utils/brand';
import { sortTokens } from './utils/color';

function processSemanticsToken(
  brandTokens: BrandTokens,
  variable: LocalVariable,
  localVariables: Record<string, LocalVariable>,
  localVariableCollections: Record<string, LocalVariableCollection>,
): void {
  const semanticParts = variable.name.split('/');
  const semanticPath = semanticParts.map(toHyphenatedLowercase).join('.');

  Object.entries(variable.valuesByMode).forEach(([modeId, modeValue]) => {
    if (typeof modeValue === 'object' && 'type' in modeValue && modeValue.type === 'VARIABLE_ALIAS') {
      const aliasedVariable = localVariables[modeValue.id];
      if (!aliasedVariable) {
        console.warn(`Aliased variable not found: ${modeValue.id}`);
        return;
      }

      // Determine the correct brand for this semantic token
      const semanticCollection = localVariableCollections[variable.variableCollectionId];
      const brands = Object.keys(brandTokens);

      brands.forEach(brand => {
        // Check if this brand has a mode that matches the current modeId
        const brandMode = semanticCollection.modes.find(mode => mode.name.toLowerCase() === brand.toLowerCase());

        if (brandMode && brandMode.modeId === modeId) {
          const val = toHyphenatedLowercase(aliasedVariable.name.replace(/\//g, '.'));
          let value;
          if (aliasedVariable.resolvedType === 'COLOR') {
            value = `{color.${val}}`;
          } else value = `{${val}}`;

          const token: TokenInfo = {
            type: tokenTypeFromVariable(variable),
            value,
            comment: variable.description || '',
          };

          const isSpacing = aliasedVariable.resolvedType === 'FLOAT';
          const targetObject = isSpacing ? brandTokens[brand].spacing : brandTokens[brand].color;
          set(targetObject, semanticPath, token);
        }
      });
    }
  });
}

export function tokenFilesFromLocalVariables(localVariablesResponse: GetLocalVariablesResponse): void {
  const localVariableCollections: Record<string, LocalVariableCollection> =
    localVariablesResponse.meta.variableCollections;
  const localVariables: Record<string, LocalVariable> = localVariablesResponse.meta.variables;
  const brandTokens: BrandTokens = {};

  // Initialize brand tokens
  BRANDS.forEach(brand => {
    brandTokens[brand] = { color: {}, spacing: {} };
  });

  // Process each collection
  Object.values(localVariableCollections).forEach(collection => {
    if (collection.hiddenFromPublishing) return;
    collection.variableIds.forEach(variableId => {
      const variable = localVariables[variableId];
      if (!variable || variable.remote) return;

      if (collection.name.toLowerCase().includes('brand') || collection.name.toLowerCase().includes('neutral')) {
        // Handle brand-specific collections
        const brand = getBrandFromCollectionName(collection.name);
        if (brand) {
          collection.modes.forEach(mode => {
            processToken(brandTokens, brand, variable, mode.modeId);
          });
        }
      } else if (collection.name.toLowerCase().includes('semantic')) {
        // Handle semantic collection
        processSemanticsToken(brandTokens, variable, localVariables, localVariableCollections);
      }
    });
  });

  // Write token files for each brand
  BRANDS.forEach(brand => {
    let outputDir;
    let colorFileName = 'color.json';
    if (brand === 'neutral') {
      outputDir = path.join('src', 'globals', 'primitives');
      colorFileName = 'colors.json';
    } else {
      outputDir = path.join('src', 'brands', brand.toLowerCase());
    }
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    addFjordlandColorsToSubbrands(brandTokens);

    const sortedSpacingTokens = sortTokens(brandTokens[brand].spacing);

    const convertedColorTokens = transformJSON(brandTokens[brand].color as InputJSON);
    const sortedColorTokens = sortTokens({ color: convertedColorTokens });

    fs.writeFileSync(path.join(outputDir, colorFileName), JSON.stringify(sortedColorTokens, null, 2));
    if (brand !== 'neutral') {
      const convertedSpacingTokens = convertSpacingJSON(sortedSpacingTokens);
      fs.writeFileSync(path.join(outputDir, 'spacing.json'), JSON.stringify(convertedSpacingTokens, null, 2));
    }
    // eslint-disable-next-line no-console -- We use console.log to output the result of token generation for debugging purposes
    console.log(`Wrote color and spacing tokens for ${brand}`);
  });
}
