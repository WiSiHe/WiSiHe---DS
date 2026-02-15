export default {
  source: [
    'tokens/primitives/**/*.json',
    'tokens/semantic/light/**/*.json',
    'tokens/component/**/*.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    'tailwind-v3': {
      transformGroup: 'js',
      buildPath: 'dist/tailwind/',
      files: [
        {
          destination: 'config.js',
          format: 'javascript/module',
        },
      ],
    },
  },
};
