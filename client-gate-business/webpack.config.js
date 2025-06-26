const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { ModuleFederationPlugin } = require("webpack").container;
const PACKAGE = require("./package.json");
const PACKAGE_NAME = PACKAGE.name;

//Just to help us with directories and folders path
const __base = path.resolve(__dirname, ".");
const __src = path.resolve(__base, "src");

module.exports = (env, argv) => {
  const is_production = argv.mode === "production";

  const config = {
    //Entry: main file that init our application
    entry: path.resolve(__src, "main.js"),

    //Output: result of the bundle after webpack run
    output: {
      filename: is_production
        ? "[name].[contenthash].bundle.js"
        : "[name].bundle.js",
      path: path.resolve(__base, "dist"),
      clean: true,
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: "Business",
        template: path.resolve(__src, "templates", "index.html"),
      }),
      new VueLoaderPlugin(),
      new ModuleFederationPlugin({
        name: `smit_gate_${PACKAGE_NAME}`,
        filename: `smit_gate_${PACKAGE_NAME}_remote.js`,
        exposes: {
          "./app": "./src/AppBusiness.vue",
        },
        remotes: {},
        shared: {
          vue: {
            singleton: true,
            eager: false,
            requiredVersion: "^3.0.0",
            strictVersion: false,
          },
        },
      }),
    ],

    //Webpack doesnt know how to handler all type of files and what to do with them, so this section
    //we can capture and configure a specific type of file and determine a loader plugin to process it
    module: {
      rules: [
        //Vue loader. Says to webpack tha files with .vue extension need to be processed by the vue-loader plugin
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        //TypeScript loader
        {
          test: /\.ts$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                appendTsSuffixTo: [/\.vue$/],
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/i,
          oneOf: [
            // Nếu có module attribute trong Vue SFC
            {
              resourceQuery: /module/,
              use: [
                "vue-style-loader",
                {
                  loader: "css-loader",
                  options: {
                    modules: {
                      localIdentName: "[name]_[local]_[hash:base64:5]",
                    },
                  },
                },
                "sass-loader",
              ],
            },
            // SCSS thông thường
            {
              use: ["vue-style-loader", "css-loader", "sass-loader"],
            },
          ],
        },
        //CSS loaders. Make possible import css files as js modules
        {
          test: /\.css$/,
          oneOf: [
            // Nếu có module attribute trong Vue SFC
            {
              resourceQuery: /module/,
              use: [
                "vue-style-loader",
                {
                  loader: "css-loader",
                  options: {
                    modules: {
                      localIdentName: "[name]_[local]_[hash:base64:5]",
                    },
                  },
                },
              ],
            },
            // CSS thông thường
            {
              use: ["vue-style-loader", "css-loader"],
            },
          ],
        },
        //Indicates that png files are assets to be processed by webpack
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
        },
      ],
    },

    resolve: {
      extensions: [".js", ".vue", ".json", ".ts"],
    },
  };

  // Production specific configuration
  if (is_production) {
    config.mode = "production";
    config.devtool = false;
    // Build vào deployment-app/public
    config.output.path = path.resolve(
      __base,
      "..",
      "deployment-app",
      "public",
      `smit_gate_${PACKAGE_NAME}`
    );
    config.output.publicPath = `/smit_gate_${PACKAGE_NAME}/`;
    // Có thể thêm các optimization khác ở đây nếu cần
  } else {
    config.mode = "development";
    config.devtool = "inline-source-map";
    config.devServer = {
      static: "./dist",
      hot: true,
      port: 17102,
      webSocketServer: false,
      client: {
        // logging: "none", // tắt logs khi save code
      },
    };
  }

  return config;
};
