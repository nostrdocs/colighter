const path = require("path");
const { merge } = require("webpack-merge");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
	const isProduction = env?.production;

	return merge(
		{
			entry: {
				app: "./src/Highlight/View/index.tsx",
				background: "./src/Highlight/background.ts",
				collabScript: "./src/Highlight/collabScript.ts",
				contentScript: "./src/Highlight/contentScript.ts",
			},
			resolve: {
				extensions: [".ts", ".tsx", ".js"],
			},
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						loader: "ts-loader",
					},
					{
						test: /\.css$/,
						use: ["style-loader", "css-loader"],
					},
					{
						test: /\.svg$/,
						use: [
							{
								loader: "svg-url-loader",
								options: {
									limit: 10000,
								},
							},
						],
					},
				],
			},
			output: {
				filename: "[name].bundle.js",
				path: path.resolve(__dirname, "dist"),
				library: "[name]",
				// https://github.com/webpack/webpack/issues/5767
				// https://github.com/webpack/webpack/issues/7939
				devtoolNamespace: "colighter",
				libraryTarget: "umd",
				publicPath: "",
			},
			plugins: [
				new webpack.ProvidePlugin({
					process: "process/browser",
				}),
				new HtmlWebpackPlugin({
					template: "./src/Highlight/View/index.html",
				}),
			],
		},
		isProduction ? require("./webpack.prod") : require("./webpack.dev"),
	);
};
