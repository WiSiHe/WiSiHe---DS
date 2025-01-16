import StyleDictionary from 'style-dictionary';
import { BRANDS } from '../src/utils/types.ts';

function getStyleDictionaryConfig(brand) {
  const buildPathBase = `dist/`;
  const sourceBase = `src/brands/${brand}/*.json`;

  return {
    source: [sourceBase],
    include: ['src/globals/**/*.json'],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: `${buildPathBase}css/${brand}/`,
        files: [
          {
            destination: 'variables.css',
            format: 'css/variables',
            options: {
              selector: `:root, :root.${brand}, .${brand}, [data-ds-theme="${brand}"]`,
            },
          },
        ],
      },
      scss: {
        transformGroup: 'scss',
        buildPath: `${buildPathBase}css/${brand}/`,
        files: [
          {
            destination: 'variables.scss',
            format: 'css/variables',
            options: {
              selector: `:root, :root.${brand}, .${brand}, [data-ds-theme="${brand}"]`,
            },
          },
        ],
      },
      json: {
        transformGroup: 'js',
        buildPath: `${buildPathBase}json/${brand}/`,
        files: [
          {
            destination: 'variables.json',
            format: 'json/flat',
          },
        ],
      },
      js: {
        transformGroup: 'js',
        buildPath: `${buildPathBase}js/${brand}/`,
        files: [
          {
            destination: 'variables.js',
            format: 'javascript/es6',
          },
        ],
      },
    },
  };
}

/**
 * Define the platforms you want to build.
 */
const platforms = ['css', 'scss', 'json', 'js'];

/**
 * Build the tokens for each brand.
 * {@see - Example based on https://github.com/amzn/style-dictionary/tree/main/examples/advanced/multi-brand-multi-platform}
 */
const buildTokens = (brands, platforms) => {
  brands.forEach(brand => {
    if (brand === 'neutral') return;
    platforms.forEach(platform => {
      try {
        const config = getStyleDictionaryConfig(brand);
        const build = StyleDictionary.extend(config);

        build.buildPlatform(platform);
        console.log(`Built ${platform} for ${brand}`);
      } catch (error) {
        console.error(`Error building ${platform} for ${brand}:`, error);
      }
    });
  });
};

buildTokens(BRANDS, platforms);
