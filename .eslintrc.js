module.exports = {
	root: true,
	parser: "vue-eslint-parser",
	parserOptions: {
		parser: "@babel/eslint-parser",
		ecmaVersion: 2020,
		sourceType: "module",
		requireConfigFile: false
	},
	env: {
		browser: true,
		commonjs: true,
		es2020: true,
		node: true
	},
	globals: {
		process: true
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-recommended"
	],
	plugins: ["prettier"],
	rules: {
		indent: [1, "tab", { SwitchCase: 1 }],
		quotes: [1, "double", { allowTemplateLiterals: true }],
		semi: [2, "always"],
		"no-var": [2],
		"no-console": [0],
		"no-unused-vars": [1],
		"no-throw-literal": 0,
		eqeqeq: [2, "smart"],
		"vue/multi-word-component-names": 0,
		"vue/html-indent": 0,
		"vue/max-attributes-per-line": 0,
		"vue/html-self-closing": 0,
		"vue/no-v-html": 0,
		"vue/attributes-order": 0,
		"vue/multiline-html-element-content-newline": 0,
		"vue/require-prop-types": 0,
		"vue/component-definition-name-casing": 0,
		"vue/order-in-components": 0,
		"vue/mustache-interpolation-spacing": 0
	}
};
