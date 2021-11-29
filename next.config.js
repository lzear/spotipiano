/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withLess = require('next-with-less')

module.exports = withPlugins(
  [
    [withBundleAnalyzer],
    [
      withLess,
      {
        lessLoaderOptions: {
          /* ... */
          lessOptions: {
            /* ... */
            modifyVars: {
              'primary-color': '#237f61',
              'border-radius-base': '2px',
              'info-color': '#7ea695',
              'text-selection-bg': '#7ea695',
              'link-focus-outline': 'auto',
              'text-color': '#333', // major text color
              'font-family':
                "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji','Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
              'code-family':
                "'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",

              /* ... */
            },
          },
        },
        lessOptions: {
          /* ... */
        },
      },
    ],
  ],
  {
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
      formats: ['image/avif', 'image/webp'],
      domains: ['i.scdn.co'],
    },
    webpack5: true,

    swcMinify: true,
    experimental: {
      // concurrentFeatures: true,
      // serverComponents: true,
    },

    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  },
)
