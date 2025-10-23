const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const version = require("../package.json").version;
const banner =
	"/**\n" +
	" * vue-form-generator v" +
	version +
	"\n" +
	" * https://github.com/vue-generators/vue-form-generator/\n" +
	" * Released under the MIT License.\n" +
	" */\n";

let cssFileName;
if (process.env.FULL_BUNDLE !== "false") {
	cssFileName = "vfg.css";
} else {
	cssFileName = "vfg-core.css";
}

let rules = [
	{
		test: /\.vue$/,
		loader: "vue-loader",
		include: [path.resolve("src")],
		exclude: /node_modules/
	},
	{
		test: /\.js$/,
		loader: "babel-loader",
		include: [path.resolve("src")],
		exclude: /node_modules/
	},
	{
		test: /\.pug$/,
		loader: "pug-plain-loader"
	},
	{
		test: /\.s[ac]ss$/i,
		use: [
			MiniCssExtractPlugin.loader,
			"css-loader",
			"sass-loader"
		]
	},
	{
		test: /\.css$/i,
		use: [
			MiniCssExtractPlugin.loader,
			"css-loader"
		]
	},
	{
		test: /\.(woff2?|svg)$/,
		type: "asset/inline",
		include: [path.resolve("src")]
	},
	{
		test: /\.(ttf|eot)$/,
		type: "asset/inline",
		include: [path.resolve("src")]
	}
];

module.exports = {
	mode: "production",
	entry: "./src/index.js",
	output: {
		path: path.resolve("dist"),
		filename: "vfg.js",
		library: {
			name: "VueFormGenerator",
			type: "umd",
			export: "default"
		},
		globalObject: "typeof self !== 'undefined' ? self : this"
	},

	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					compress: {
						warnings: false
					}
				},
				extractComments: false
			})
		]
	},

	plugins: [
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			__VUE_OPTIONS_API__: JSON.stringify(true),
			__VUE_PROD_DEVTOOLS__: JSON.stringify(false),
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
		}),
		new LodashModuleReplacementPlugin({
			collections: true,
			paths: true
		}),
		new webpack.BannerPlugin({
			banner,
			raw: true
		}),
		new MiniCssExtractPlugin({
			filename: cssFileName
		}),
		new ESLintPlugin({
			extensions: ["js", "vue"],
			context: path.resolve("src"),
			formatter: require("eslint-friendly-formatter")
		})
	],

	module: {
		rules
	},

	resolve: {
		extensions: [".js", ".vue", ".json"],
		alias: {
			vue$: "vue/dist/vue.esm-bundler.js",
			"@": path.resolve("src")
		}
	}
};
