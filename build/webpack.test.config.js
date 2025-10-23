const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const nodeExternals = require("webpack-node-externals");
const ESLintPlugin = require("eslint-webpack-plugin");

let rules = [
	{
		test: /\.vue$/,
		loader: "vue-loader",
		include: [path.resolve("src"), path.resolve("test")],
		exclude: /node_modules/
	},
	{
		test: /\.js$/,
		loader: "babel-loader",
		include: [path.resolve("src"), path.resolve("test")],
		exclude: /node_modules/
	},
	{
		test: /\.pug$/,
		loader: "pug-plain-loader"
	},
	{
		test: /\.s[ac]ss$/i,
		use: [
			"vue-style-loader",
			"css-loader",
			"sass-loader"
		]
	},
	{
		test: /\.(woff2?|svg)$/,
		type: "asset/inline",
		include: [path.resolve("src"), path.resolve("test")]
	},
	{
		test: /\.(ttf|eot)$/,
		type: "asset/inline",
		include: [path.resolve("src"), path.resolve("test")]
	}
];

module.exports = {
	mode: "development",
	devtool: "inline-cheap-module-source-map",

	entry: "./src/index.js",

	output: {
		path: path.resolve("dist"),
		filename: "vfg.js",
		library: {
			name: "VueFormGenerator",
			type: "umd"
		}
	},

	module: {
		rules
	},

	plugins: [
		new VueLoaderPlugin(),
		new ESLintPlugin({
			extensions: ["js", "vue"],
			context: path.resolve("src"),
			formatter: require("eslint-friendly-formatter")
		})
	],

	resolve: {
		extensions: [".js", ".vue", ".json"],
		alias: {
			vue$: "vue/dist/vue.esm-bundler.js",
			src: path.resolve("src")
		}
	},

	externals: [nodeExternals()]
};
