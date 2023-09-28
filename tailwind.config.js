const typographyPlugin = require('@tailwindcss/typography')

const typographyStyles = require('./typography')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  plugins: [
    typographyPlugin,
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('autoprefixer'),
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        backgroundFocus: '#131C31',
        menuTextWhite: '#94A9C9',
        focusBlue: '#1CC2E7',
        myPrimary: '#1CC2E7',
        myWhite: '#FFFFFF',
        myBlack: '#000000',
        primaryText: '#94A9C9',
        textTitleColor: '#b9e0f2',
        borderColor: '#222F43',
        blockColor: '#131C31',
        tagColor: '#66768F',
        formLabelColor: '#7F9280',
        inputBorderColor: '#ced4da',
      },
    },
    
    fontSize: {
      textTitleSize: ['24px', {lineHeight: '28px'}],  
      menuText: ['16px', {lineHeight: '16px'}],
      xs: ['0.8125rem', { lineHeight: '1.5rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '3.5rem' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    typography: typographyStyles,
  },
}