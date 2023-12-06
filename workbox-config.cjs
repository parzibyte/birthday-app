module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,wasm,css,html,png,json,svg}'
	],
	swDest: 'dist/sw.js',
	sourcemap: false,
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/,
		/^id/
	]
};