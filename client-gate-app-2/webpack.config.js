const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { ModuleFederationPlugin } = require("webpack").container;

//Just to help us with directories and folders path
const __base = path.resolve(__dirname, ".");
const __src = path.resolve(__base, "src");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const isDevelopment = argv.mode === "development";

  const config = {
    //Entry: main file that init our application
    entry: path.resolve(__src, "main.js"),

    //Output: result of the bundle after webpack run
    output: {
      filename: isProduction
        ? "[name].[contenthash].bundle.js"
        : "[name].bundle.js",
      path: path.resolve(__base, "dist"),
      clean: true,
    },

    //Plugins to help and include additionals functionalities to webpack
    plugins: [
      new HtmlWebpackPlugin({
        title: "App 2",
        template: path.resolve(__src, "templates", "index.html"),
      }),
      new VueLoaderPlugin(),
      new ModuleFederationPlugin({
        name: "client_gate_app_2",
        filename: "client_gate_app_2-remote.js",
        exposes: {
          "./app": "./src/App.vue",
        },
        remotes: isProduction
          ? {
              shared:
                "client_gate_shared_dependency@/smit-gate-shared-dependency/client_gate_shared_dependency-remote.js",
            }
          : {
              shared:
                "client_gate_shared_dependency@http://localhost:17101/client_gate_shared_dependency-remote.js",
            },
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
        //CSS loaders. Make possible import css files as js modules
        {
          test: /\.css$/,
          use: ["vue-style-loader", "css-loader"],
        },
        //Indicates that png files are assets to be processed by webpack
        {
          test: /\.png$/,
          type: "asset/resource",
        },
      ],
    },

    resolve: {
      extensions: [".js", ".vue", ".json"],
    },
  };

  // Development specific configuration
  if (isDevelopment) {
    config.mode = "development";
    config.devtool = "inline-source-map";
    config.devServer = {
      static: "./dist",
      hot: true,
      port: 17103,
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
      "smit-gate-app-2"
    );
    config.output.publicPath = "/smit-gate-app-2/";
    // Có thể thêm các optimization khác ở đây nếu cần
  }

  return config;
};
