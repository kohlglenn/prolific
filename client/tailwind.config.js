module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  theme: {
    extend: {},
    scale: {
      '0': '0',
      '25': '.25',
      '50': '.5',
      '75': '.75',
      '90': '.9',
      '95': '.95',
      '100': '1',
      '105': '1.05',
      '110': '1.1',
      '125': '1.25',
      '150': '1.5',
      '200': '2',
      '-1': '-1'
    },
    inset: {
      '0': '0rem',
      '6': '1.5rem',
      '8': '2rem',
      '-1': '-0.25rem',
      '-6': '-1.5rem',
      '-48': '-12rem',
      '-52': '-13rem',
      '-56': '-14rem',
    }
  },
  variants: {},
  plugins: [],
}
