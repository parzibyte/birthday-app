module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,wasm,css,html,png,json,svg}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/,
		/^id/
	]
};