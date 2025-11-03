const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const ESLintPlugin = require("eslint-webpack-plugin");
const projectRoot = path.resolve(__dirname, "../");

let rules = [
	{
		test: /\.vue$/,
		loader: "vue-loader",
		include: [path.resolve("src"), path.resolve("dev")],
		exclude: /node_modules/
	},
	{
		test: /\.js$/,
		loader: "babel-loader",
		include: [path.resolve("src"), path.resolve("dev")],
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
		test: /\.css$/i,
		use: [
			"vue-style-loader",
			"css-loader"
		]
	},
	{
		test: /\.(woff2?|svg)$/,
		type: "asset/inline",
		include: [path.resolve("src"), path.resolve("dev")]
	},
	{
		test: /\.(ttf|eot)$/,
		type: "asset/inline",
		include: [path.resolve("src"), path.resolve("dev")]
	}
];

module.exports = {
	mode: "development",
	devtool: "source-map",
	devServer: {
		static: [
			{
				directory: path.resolve("dev/projects")
			}
		],
		hot: true,
		port: 8085
	},
	entry: {
		full: path.resolve("dev", "projects", "full", "main.js"),
		basic: path.resolve("dev", "projects", "basic", "main.js"),
		mselect: path.resolve("dev", "projects", "multiselect", "main.js"),
		grouping: path.resolve("dev", "projects", "grouping", "main.js"),
		checklist: path.resolve("dev", "projects", "checklist", "main.js"),
		picker: path.resolve("dev", "projects", "picker", "main.js")
	},

	output: {
		path: path.resolve("dev/projects"),
		filename: "[name].js",
		publicPath: "/"
	},

	plugins: [
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			__VUE_OPTIONS_API__: JSON.stringify(true),
			__VUE_PROD_DEVTOOLS__: JSON.stringify(false),
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
			"process.env": {
				NODE_ENV: JSON.stringify("development"),
				FULL_BUNDLE: true
			}
		}),
		new ESLintPlugin({
			extensions: ["js", "vue"],
			files: ["src/**/*.{js,vue}", "dev/**/*.{js,vue}"],
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
