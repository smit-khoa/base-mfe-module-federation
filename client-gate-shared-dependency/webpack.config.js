const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { ModuleFederationPlugin } = require("webpack").container;
const { DefinePlugin } = require("webpack");

//Just to help us with directories and folders path
const __base = path.resolve(__dirname, ".");
const __src = path.resolve(__base, "src");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const isDevelopment = argv.mode === "development";

  const plugins = [
    new HtmlWebpackPlugin({
      title: "Shared View",
      template: path.resolve(__src, "templates", "index.html"),
    }),
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: "client_gate_shared_dependency",
      filename: "client_gate_shared_dependency-remote.js",
      exposes: {
        "./styles": "./src/static/global.css",
        "./common": "./src/index.js",
      },
      shared: {
        vue: {
          singleton: true,
          eager: true,
          requiredVersion: "^3.0.0",
          strictVersion: false,
        },
      },
    }),
  ];

  if (isDevelopment) {
    plugins.push(
      new DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      })
    );
  }

  const config = {
    entry: path.resolve(__src, "main.js"),
    output: {
      filename: isProduction
        ? "[name].[contenthash].bundle.js"
        : "[name].bundle.js",
      path: path.resolve(__base, "dist"),
      clean: true,
    },

    plugins,

    resolve: {
      alias: {
        "@": path.resolve(__base, "src"),
        "@components": path.resolve(__base, "src", "components"),
        "@lib": path.resolve(__base, "src", "lib"),
        "@utils": path.resolve(__base, "src", "utils"),
      },
      extensions: [".js", ".vue", ".json", ".ts", ".tsx"],
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.css$/,
          use: ["vue-style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.png$/,
          type: "asset/resource",
        },
        {
          test: /\.ts$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                appendTsSuffixTo: [/\.vue$/],
                compilerOptions: {
                  noEmit: false,
                  declaration: false,
                },
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                compilerOptions: {
                  noEmit: false,
                  declaration: false,
                  jsx: "react-jsx",
                },
              },
            },
          ],
          // exclude: /node_modules\/(?!.*shadcn).*$/,
          exclude: /node_modules\/(?!.*client_gate_shared_dependency).*$/,
        },
      ],
    },
  };

  // Development specific configuration
  if (isDevelopment) {
    config.mode = "development";
    config.devtool = "inline-source-map";
    config.devServer = {
      static: "./dist",
      hot: true,
      port: 17101,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      client: {
        logging: "none", // tắt logs khi save code
      },
    };
  }

  // Production specific configuration
  if (isProduction) {
    config.mode = "production";
    config.devtool = false;
    // Build vào deployment-app/public
    config.output.path = path.resolve(
      __base,
      "..",
      "deployment-app",
      "public",
      "smit-gate-shared-dependency"
    );
    config.output.publicPath = "/smit-gate-shared-dependency/";
  }

  return config;
};
