const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { ModuleFederationPlugin } = require("webpack").container;

//Just to help us with directories and folders path
const __base = path.resolve(__dirname, ".");
const __src = path.resolve(__base, "src");

// Custom plugin để cập nhật index.html
class UpdateIndexPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("UpdateIndexPlugin", (compilation) => {
      if (compiler.options.mode === "production") {
        try {
          const updateIndexHtml = require("./update-index.js");
          updateIndexHtml();
        } catch (error) {
          console.error("❌ Lỗi khi cập nhật index.html:", error.message);
        }
      }
    });
  }
}

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
      publicPath: isProduction ? "./smit-gate-root-config/" : "/",
      clean: true,
      chunkLoadingGlobal: "webpackChunkcontainer_host",
    },

    //Plugins to help and include additionals functionalities to webpack
    plugins: [
      new HtmlWebpackPlugin({
        title: "Root Config",
        template: path.resolve(__src, "templates", "index.html"),
      }),
      new VueLoaderPlugin(),
      new ModuleFederationPlugin({
        name: "container_host",
        remotes: isProduction
          ? {
              shared:
                "client_gate_shared_dependency@./smit-gate-shared-dependency/client_gate_shared_dependency-remote.js",
              client_gate_app_1:
                "client_gate_app_1@./smit-gate-app-1/client_gate_app_1-remote.js",
              client_gate_app_2:
                "client_gate_app_2@./smit-gate-app-2/client_gate_app_2-remote.js",
              client_gate_home:
                "client_gate_home@./smit-gate-home/client-gate-home-remote.js",
            }
          : {
              // Development URLs
              shared:
                "client_gate_shared_dependency@http://localhost:17101/client_gate_shared_dependency-remote.js",
              client_gate_app_1:
                "client_gate_app_1@http://localhost:17102/client_gate_app_1-remote.js",
              client_gate_app_2:
                "client_gate_app_2@http://localhost:17103/client_gate_app_2-remote.js",
              client_gate_home:
                "client_gate_home@http://localhost:17104/client-gate-home-remote.js",
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
      // Thêm plugin tự động cập nhật index.html cho production
      ...(isProduction ? [new UpdateIndexPlugin()] : []),
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
      extensions: [".js", ".vue", ".json", ".ts"],
    },

    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
        },
      },
      runtimeChunk: false,
    },
  };

  // Development specific configuration
  if (isDevelopment) {
    config.mode = "development";
    config.devtool = "inline-source-map";
    config.devServer = {
      static: "./dist",
      hot: true,
      // liveReload: false,
      port: 17100,
      historyApiFallback: true,

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
      "smit-gate-root-config"
    );
  }

  return config;
};
