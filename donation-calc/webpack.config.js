const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: [
    "./index.js"
  ],
  output: {
    filename: "donation-calc.js",
    path: path.resolve(__dirname, "..", "js"),
    publicPath: "/js/"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
    ]
  }
};
