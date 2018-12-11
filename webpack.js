const path = require("path")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
	entry: "./react/index.jsx",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "public"),
	},
	plugins: [
		new CleanWebpackPlugin(["public",]),
		new CopyWebpackPlugin([
			{
				from: "react",
				to: "",
				ignore: [
					"*.jsx",
				],
			},
		]),
	],
	module: {
		rules: [
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react",],
						plugins: [
							["@babel/plugin-proposal-class-properties", { loose: true, },],
							["@babel/plugin-transform-runtime",],
						],
					},
				},
			},
		],
	},
}
