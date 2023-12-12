const typographyPlugin = require('@tailwindcss/typography')

const typographyStyles = require('./typography')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  darkMode: 'class',
  plugins: [
    typographyPlugin,
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('autoprefixer'),
    require('flowbite/plugin'),
  ],
  theme: {
    extend: {
      colors: {
        BG: '#111827',
        MenuBG: '#1E293C',
        MenuBGLight: '#374151',
        MenuBorder: '#353F4F',
        MenuDivider: '#384356',
        Primary: '#A9FF71',
        PrimaryStart: '#7bff25',
        PrimaryEnd: '#d7ffbe',
        PrimaryText: '#94A9C9',
        SubText: '#94A9C9',
        MyWhite: '#FFFFFF',
        MyBlack: '#000000',
        Warning: '#ff71a9',
        Success: '#71a9ff',

        backgroundFocus: '#131C31',
        menuTextWhite: '#94A9C9',
        focusBlue: '#84CC16',
        myWhite: '#FFFFFF',
        myBlack: '#000000',
        primaryText: '#94A9C9',
        textTitleColor: '#bef264',
        borderColor: '#222F43',
        blockColor: '#131C31',
        blockHoverColor: '#1A2536',
        tagColor: '#66768F',
        formLabelColor: '#7F9280',
        inputBorderColor: '#ced4da',
        breadcrumbColor: '#667085',
      },
    },
    typography: typographyStyles,
  },
}
