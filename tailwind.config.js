/** @type {import('tailwindcss').Config} */
export default {
  content: [
    'index.html',
    'src/**/*.html',
    'src/**/*.js',
    'src/**/*.vue',
  ],

  theme: {
    container: {
      center: true,
    },
    extend: {},
  },

  plugins: [
    require('daisyui')
  ],

  // daisyUI safelist
  safelist: [
    // Backgrounds
    { pattern: /bg-*/ },

    // Text
    { pattern: /text-*/ },

    // Width
    { pattern: /w-*/ },

    // Height
    { pattern: /h-*/ },

    // Buttons
    { pattern: /btn-*/ },

    // Loading
    { pattern: /loading-*/ },

    // Inputs (focus|hover|active)
    {
        pattern: /input-*/,
        variants: ['focus', 'hover', 'active']
    },
  ],

  // daisyui config
  daisyui: {
    logs: false,
    themes: [
      'light', 'dark'
    ],
  },
}

