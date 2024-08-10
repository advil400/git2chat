import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';


export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/quill/dist/quill.snow.css', // Include Quill styles
	  ],
	  theme: {
		extend: {
		  minHeight: {
			screen: '100vh',
		  },
		  transitionProperty: {
			'opacity': 'opacity',
		  },
		},
	  },
	plugins: [typography]
} satisfies Config;
