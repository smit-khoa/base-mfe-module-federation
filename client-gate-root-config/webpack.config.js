const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { ModuleFederationPlugin } = require("webpack").container;
const generateProxyConfig = require("./dev-proxy-config");
const PACKAGE = require("./package.json");
const PACKAGE_NAME = PACKAGE.name;

const __base = path.resolve(__dirname, ".");
const __src = path.resolve(__base, "src");

// mỗi khi build sẽ tạo mới file index.html tổng
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
  const is_production = argv.mode === "production";
  const config_module = generateProxyConfig({
    DEV_PORT: {
      root_config: "8333",
      shared_dependency: "17101",
      business: "17102",
      app_2: "17103",
      home: "17104",
    },
    is_production,
  });

  const config = {
    //Entry: main file that init our application
    entry: path.resolve(__src, "main.js"),

    //Output: result of the bundle after webpack run
    output: {
      filename: is_production
        ? "[name].[contenthash].bundle.js"
        : "[name].bundle.js",
      path: path.resolve(__base, "dist"),
      publicPath: is_production ? `./smit_gate_${PACKAGE_NAME}/` : "/",
      clean: true,
      chunkLoadingGlobal: "webpackChunkcontainer_host",
    },

    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        title: "SMIT Gate v2",
        template: path.resolve(__src, "templates", "index.html"),
      }),
      new ModuleFederationPlugin({
        name: `smit_gate_${PACKAGE_NAME}`,
        remotes: config_module.remote,
        shared: {
          vue: {
            singleton: true,
            eager: true,
            requiredVersion: "^3.0.0",
            strictVersion: false,
          },
        },
      }),

      ...(is_production ? [new UpdateIndexPlugin()] : []),
    ],

    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.s[ac]ss$/i,
          oneOf: [
            {
              resourceQuery: /module/,
              use: [
                "vue-style-loader",
                {
                  loader: "css-loader",
                  options: {
                    modules: {
                      localIdentName: is_production
                        ? "[hash:base64:10]"
                        : "[name]_[local]_[hash:base64:10]",
                    },
                  },
                },
                "sass-loader",
              ],
            },
            {
              use: ["vue-style-loader", "css-loader", "sass-loader"],
            },
          ],
        },
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
          test: /\.css$/,
          oneOf: [
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
            {
              use: ["vue-style-loader", "css-loader"],
            },
          ],
        },

        {
          test: /\.(png|jpe?g|gif|svg)$/i,
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
  } else {
    config.mode = "development";
    config.devtool = "inline-source-map";
    config.devServer = {
      static: "./dist",
      hot: true,
      port: 8333,
      historyApiFallback: true,
      https: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods":
        //   "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        // "Access-Control-Allow-Headers":
        //   "X-Requested-With, content-type, Authorization",
      },

      client: {
        logging: "none",
      },
      allowedHosts: "all",
      proxy: config_module.proxy,
    };
  }

  return config;
};
