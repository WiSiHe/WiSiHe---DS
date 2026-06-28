export default {
  source: [
    'tokens/primitives/**/*.json',
    'tokens/semantic/**/*.json',
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
  },
};
