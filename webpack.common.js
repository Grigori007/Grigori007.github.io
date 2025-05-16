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
            {
                test: /\.3ds$/,
                type: 'asset/resource', // this emits the file and gives you the URL
            }
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/template.html",
            filename: "index.html"
        })
    ]
}