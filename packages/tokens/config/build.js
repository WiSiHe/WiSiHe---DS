import StyleDictionary from "style-dictionary"

function getStyleDictionaryConfig(brand) {
  return {
    source: [`src/brands/${brand}/*.json`, "src/globals/**/*.json"],
    platforms: {
      /**
       * Available platforms: https://amzn.github.io/style-dictionary/#/config?id=platform
       */
      css: {
        transformGroup: "css",
        buildPath: `dist/css/${brand}/`,
        files: [
          {
            destination: "variables.css",
            format: "css/variables",
            options: {
              selector: `:root, :root.${brand}`,
            },
          },
        ],
      },
    },
  }
}

/**
 * Define the brands you want to build.
 * These should match the names of your Figma modes.
 */
const brands = ["tine", "diplom-is"]

/**
 * Define the platforms you want to build.
 */
const platforms = ["css"]

/**
 * Build the tokens for each brand.
 * {@see - Example based on https://github.com/amzn/style-dictionary/tree/main/examples/advanced/multi-brand-multi-platform}
 */
brands.map(function (brand) {
  platforms.map(function (platform) {
    const build = StyleDictionary.extend(getStyleDictionaryConfig(brand, platform))

    build.buildPlatform(platform)
  })
})
