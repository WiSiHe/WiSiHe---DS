/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				dark: '#2B061E',
				primary: '#DE0D92',
				secondary: '#31493C',
				tertiary: '#F2F2F2',
				shadow: '#203647',
				highlight: '#FAE20C',
				bright: '#C2CACD'
			}
		}
	},
	plugins: []
};
