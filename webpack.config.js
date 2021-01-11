const path = require("path");
const htmlPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  return {
    mode: argv.mode || "development",
    entry: {
      app: path.join(__dirname, "src", "index.tsx"),
    },
    target: "web",
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
            },
          ],
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
            {
              loader: "less-loader",
            },
          ],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
            },
          ],
        },
      ],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
    },
    devServer: {
      historyApiFallback: true,
      port: 1437,
    },
    plugins: [
      new htmlPlugin({
        filename: "index.html",
        template: "./src/index.html",
        favicon: "./src/favicon/favicon.ico",
        hash: true,
      }),
    ],
    performance: {
      hints: false,
    },
    optimization: {
      splitChunks: {
        chunks: "async",
        minSize: 10000,
        maxSize: 100000,
        maxAsyncRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  };
};
