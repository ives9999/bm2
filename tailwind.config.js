const typographyPlugin = require('@tailwindcss/typography');
const typographyStyles = require('./typography');
const colors = require('tailwindcss/colors');
const {lerpColors} = require('tailwind-lerp-colors');

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
        colors: lerpColors({
            transparent: 'transparent',
            current: 'currentColor',
            primary: '#a9ff71',
            secondary: '#35C3FF',
            warning: '#ef4444',
            Primary: {
                '50': '#f2ffe5',
                '100': '#e1ffc7',
                '200': '#c3ff95',
                '300': '#a9ff71',
                '400': '#75f625',
                '500': '#53dd05',
                '600': '#3db100',
                '700': '#2f8605',
                '800': '#29690b',
                '900': '#24590e',
                '950': '#0e3201',
            },
            BG: {
                '50': '#f4f6fb',
                '100': '#e8ecf6',
                '200': '#cbd8ec',
                '300': '#9db6dc',
                '400': '#6990c7',
                '500': '#4672b1',
                '600': '#345995',
                '700': '#2b4779',
                '800': '#273e65',
                '900': '#253555',
                '950': '#111827',
            },
            PrimaryBlock: {
                '50': '#f4f6fb',
                '100': '#e9edf5',
                '200': '#cedae9',
                '300': '#a2bad7',
                '400': '#7094c0',
                '500': '#4e78a9',
                '600': '#3c5f8d',
                '700': '#314d73',
                '800': '#2c4260',
                '900': '#293951',
                '950': '#1e293c',
            },
            'sugar-cane': {
                '50': '#f7fff2',
                '100': '#e5ffd7',
                '200': '#ccffb2',
                '300': '#a3ff76',
                '400': '#72f533',
                '500': '#4ede09',
                '600': '#3cb900',
                '700': '#319005',
                '800': '#2a710a',
                '900': '#225d0a',
                '950': '#0f3400',
            },
            Warning: {
                '50': '#fef2f2',
                '100': '#fee2e2',
                '200': '#fecaca',
                '300': '#fca5a5',
                '400': '#f87171',
                '500': '#ef4444',
                '600': '#dc2626',
                '700': '#b91c1c',
                '800': '#991b1b',
                '900': '#7f1d1d',
                '950': '#450a0a',
            },
            Success: {
                '50': '#f0faff',
                '100': '#dff4ff',
                '200': '#b8e9ff',
                '300': '#71d8ff',
                '400': '#33c9fd',
                '500': '#09b2ee',
                '600': '#008fcc',
                '700': '#0072a5',
                '800': '#046088',
                '900': '#0a5070',
                '950': '#06324b',
            },
            'hot-pink': {
                '50': '#fef1f8',
                '100': '#fee5f2',
                '200': '#ffcbe8',
                '300': '#ffa1d3',
                '400': '#ff67b3',
                '500': '#fa3a95',
                '600': '#ea1870',
                '700': '#cc0a57',
                '800': '#a80c47',
                '900': '#8c0f3e',
                '950': '#560121',
            },
            'lunar-green': {
                '50': '#f3f5f0',
                '100': '#e4e8df',
                '200': '#ccd4c2',
                '300': '#acb99d',
                '400': '#8f9f7c',
                '500': '#72835f',
                '600': '#586749',
                '700': '#45503b',
                '800': '#373f30',
                '900': '#333a2d',
                '950': '#191e15',
            },
            'rabbit': {
                '50': '#ffffff',
                '100': '#efefef',
                '200': '#dcdcdc',
                '300': '#bdbdbd',
                '400': '#989898',
                '500': '#7c7c7c',
                '600': '#656565',
                '700': '#525252',
                '800': '#464646',
                '900': '#3d3d3d',
                '950': '#292929',
            },
            'bear': {
                '50': '#f6f6f6',
                '100': '#e7e7e7',
                '200': '#d1d1d1',
                '300': '#b0b0b0',
                '400': '#888888',
                '500': '#6d6d6d',
                '600': '#5d5d5d',
                '700': '#4f4f4f',
                '800': '#454545',
                '900': '#3d3d3d',
                '950': '#000000',
            },
        }, {
            // function options (all optional)
            includeBase: true,
            includeLegacy: false,
            lerpEnds: true,
            interval: 25,
            mode: 'lrgb',
        }),
        extend: {
            colors: {
                MenuBGLight: '#374151',
                MenuDivider: '#384356',
                PrimaryText: '#94A9C9',
                SubText: '#E5FFD7',
                MyWhite: '#FFFAFA',
                MyBlack: '#000000',
                backgroundFocus: '#131C31',
                menuTextWhite: '#94A9C9',
                focusBlue: '#84CC16',
                primaryText: '#94A9C9',
                textTitleColor: '#bef264',
                borderColor: '#222F43',
                blockColor: '#131C31',
                blockHoverColor: '#1A2536',
                tagColor: '#66768F',
                inputBorderColor: '#ced4da',
                breadcrumbColor: '#667085',
            },
            transitionProperty: {
                'height': 'height',
                'spacing': 'margin, padding'
            },
        },
        typography: typographyStyles,
    },
}
