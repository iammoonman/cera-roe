/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
	theme: {
		extend: {
			maxHeight: { "1/2": "50%" },
		},
	},
	plugins: [],
};
