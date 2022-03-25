const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    module: {
        rules: [
            {
                test: /\.css?$/,
                use: ["style-loader", "css-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({ template: "./src/template.html" })
    ]
}