// Default color palette is black when no themes presented

const backgroundsColors = {
  transparent: 'transparent',
  'layer-0': 'var(--bg-layer-0, #000000)',
  'layer-1': 'var(--bg-layer-1, #090D13)',
  'layer-2': 'var(--bg-layer-2, #141A23)',
  'layer-3': 'var(--bg-layer-3, #222932)',
  'layer-4': 'var(--bg-layer-4, #333942)',
  blackout: 'var(--bg-blackout, #090D13B3)',
  error: 'var(--bg-error, #402027)',
  'model-icon': 'var(--bg-model-icon, #FFFFFF)',
  'accent-primary': 'var(--bg-accent-primary, #5C8DEA)',
  'accent-secondary': 'var(--bg-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--bg-accent-tertiary, #A972FF)',
  'accent-primary-alpha': 'var(--bg-accent-primary-alpha, #5C8DEA2B)',
  'accent-secondary-alpha': 'var(--bg-accent-secondary-alpha, #37BABC26)',
  'accent-tertiary-alpha': 'var(--bg-accent-tertiary-alpha, #A972FF2B)',
};

const buttonsBgColors = {
  'controls-accent': 'var(--controls-bg-accent, #5C8DEA)',
  'controls-accent-hover': 'var(--controls-bg-accent-hover, #4878D2)',
  'controls-accent-alpha': 'var(--controls-bg-accent-alpha, #5C8DEA2B)',
  'controls-secondary': 'var(--controls-texts-permanent, #333942)',
  'controls-disable': 'var(--controls-bg-disable, #7F8792)',
  'controls-enable-primary': 'var(--controls-enable-primary, #FCFCFC)',
  'controls-enable-secondary': 'var(--controls-enable-secondary, #FCFCFC)',
};

const borderColors = {
  transparent: 'transparent',
  primary: 'var(--stroke-primary, #333942)',
  secondary: 'var(--stroke-secondary, #222932)',
  tertiary: 'var(--stroke-tertiary, #090D13)',
  error: 'var(--stroke-error, #F76464)',
  hover: 'var(--stroke-hover, #F3F4F6)',
  'accent-primary': 'var(--stroke-accent-primary, #5C8DEA)',
  'accent-primary-hover': 'var(--stroke-accent-primary, #4878d2)',
  'accent-secondary': 'var(--stroke-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--stroke-accent-tertiary, #A972FF)',
  disabled: 'var(--stroke-disabled, #7F8792)',
};

const textColors = {
  transparent: 'transparent',
  primary: 'var(--text-primary, #F3F4F6)',
  secondary: 'var(--text-secondary, #7F8792)',
  error: 'var(--text-error, #F76464)',
  'accent-primary': 'var(--text-accent-primary, #5C8DEA)',
  'accent-secondary': 'var(--text-accent-secondary, #37BABC)',
  'accent-tertiary': 'var(--text-accent-tertiary, #A972FF)',
  'controls-permanent': 'var(--controls-text-permanent, #FCFCFC)',
  'controls-disable': 'var(--controls-text-disable, #333942)',
  progress: 'var(--text-progress, #D97C27)',
};

const buttonsTextColors = {
  'controls-primary': 'var(--controls-primary, #FCFCFC)',
  'controls-accent': 'var(--controls-accent, #5c8dea)',
  'controls-disable': 'var(--controls-disable, #333942)',
};

const iconColors = {
  'icon-error': 'var(--icon-error, #F76464)',
  'icon-accent-secondary': 'var(--icon-accent-secondary, #37BABC)',
  'icon-accent-primary': 'var(--icon-accent-primary, #5C8DEA)',
  'icon-secondary': 'var(--icon-secondary, #7F8792)',
  'icon-primary': 'var(--icon-primary, #F3F4F6)',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
    '../../libs/common/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    backgroundColor: { ...backgroundsColors, ...buttonsBgColors },
    borderColor: borderColors,
    stroke: borderColors,
    divideColor: borderColors,
    textColor: { ...textColors, ...buttonsTextColors, ...iconColors },
    gradientColorStops: backgroundsColors,
    extend: {
      animation: {
        'spin-steps': 'spin 0.75s steps(8, end) infinite',
      },
      boxShadow: {
        DEFAULT: '0 0 4px 0 var(--bg-blackout, #090D13B3)',
      },
      borderRadius: {
        DEFAULT: '3px',
      },
      opacity: {
        15: '15%',
      },
      colors: {
        transparent: 'transparent',
      },
      fontFamily: {
        DEFAULT: ['var(--theme-font, var(--font-inter))'],
      },
      fontSize: {
        xxs: '10px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text-primary, #F3F4F6)',
            a: {
              color: 'var(--text-accent-primary, #5C8DEA)',
            },
            pre: {
              border: 'none',
              borderRadius: '0',
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
