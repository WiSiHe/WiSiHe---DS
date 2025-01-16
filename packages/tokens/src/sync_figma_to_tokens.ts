import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import dotenv from 'dotenv';
import { BRANDS } from './utils/types';
import FigmaApi from './figma_api';
import { tokenFilesFromLocalVariables } from './token_export';

dotenv.config();

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN || '';
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || '';

/**
 * Generates the exports object for package.json
 * @returns The exports object
 */
function generateExports(): Record<string, string> {
  const exports: Record<string, string> = {};
  const sortedBrands = [...BRANDS].sort();

  for (const brand of sortedBrands) {
    if (brand === 'neutral') continue;

    const brandLower = brand.toLowerCase();
    const formats = ['css', 'scss', 'json', 'js'];

    for (const format of formats) {
      const key = `./${brandLower}/${format}`;
      const value = getExportPath(brandLower, format);
      exports[key] = value;
    }
  }

  // Add static exports
  exports['./package.json'] = './package.json';
  exports['./CHANGELOG.md'] = './CHANGELOG.md';

  return exports;
}

/**
 * Gets the export path for a given brand and format
 * @param brand - The brand name
 * @param format - The file format
 * @returns The export path
 */
function getExportPath(brand: string, format: string): string {
  if (format === 'css' || format === 'scss') {
    return `./dist/css/${brand}/variables.${format}`;
  }
  return `./dist/${format}/${brand}/variables.${format}`;
}

/**
 * Updates the package.json file with new exports
 */
async function updatePackageJson(): Promise<void> {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

  packageJson.exports = await generateExports();

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json has been updated with new exports');
}

/**
 * Validates the environment variables
 * @throws {@link Error }
 * If required environment variables are missing
 */
function validateEnvironment(): void {
  if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
    throw new Error('FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY environment variables are required');
  }
}

/**
 * Fetches variables from Figma and generates token files
 */
async function generateTokenFiles(): Promise<void> {
  const api = new FigmaApi(FIGMA_ACCESS_TOKEN);
  const localVariables = await api.getLocalVariables(FIGMA_FILE_KEY);
  tokenFilesFromLocalVariables(localVariables);
  // eslint-disable-next-line no-console -- necessary to inform the user that token files have been generated
  console.log('✅ Token files have been successfully generated and written to the brands directory');
}

/**
 * Main function to run the script
 */
async function main(): Promise<void> {
  try {
    validateEnvironment();
    await generateTokenFiles();
    await updatePackageJson();
  } catch (error) {
    console.error('An error occurred:', (error as Error).message);
    process.exit(1);
  }
}

void main();
