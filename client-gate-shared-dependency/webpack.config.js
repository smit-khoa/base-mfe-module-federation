const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { VueLoaderPlugin } = require("vue-loader")
const { ModuleFederationPlugin } = require("webpack").container
const { DefinePlugin } = require("webpack")
const PACKAGE = require("./package.json")
const PACKAGE_NAME = PACKAGE.name

const __base = path.resolve(__dirname, ".")
const __src = path.resolve(__base, "src")

module.exports = (env, argv) => {
    const is_production = argv.mode === "production"

    const plugins = [
        new HtmlWebpackPlugin({
            title: "SMIT Gate Shared",
            template: path.resolve(__src, "templates", "index.html")
        }),
        new VueLoaderPlugin(),
        new ModuleFederationPlugin({
            name: `smit_gate_${PACKAGE_NAME}`,
            filename: `smit_gate_${PACKAGE_NAME}_remote.js`,
            exposes: {
                "./app": "./src/App.vue",
                "./styles": "./src/static/global.css",
                "./common": "./src/index.js",
                "./components/custom": "./src/components/custom/index.js",
                "./components/ui": "./src/components/ui/index.js",
                "./sprites": "./src/assets/images/sprites.svg"
            },
            shared: {
                vue: {
                    singleton: true,
                    eager: true,
                    requiredVersion: "^3.0.0",
                    strictVersion: false
                }
            }
        })
    ]

    if (!is_production) {
        plugins.push(
            new DefinePlugin({
                __VUE_OPTIONS_API__: JSON.stringify(true),
                __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
            })
        )
    }

    const config = {
        entry: path.resolve(__src, "main.js"),
        output: {
            filename: is_production ? "[name].[contenthash].bundle.js" : "[name].bundle.js",
            path: path.resolve(__base, "dist"),
            clean: true
        },

        plugins,

        resolve: {
            alias: {
                "@": path.resolve(__base, "src"),
                "@components": path.resolve(__base, "src", "components"),
                "@lib": path.resolve(__base, "src", "lib"),
                "@utils": path.resolve(__base, "src", "utils")
            },
            extensions: [".js", ".vue", ".json", ".ts", ".tsx"]
        },

        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: "vue-loader"
                },
                {
                    test: /\.css$/,
                    use: ["vue-style-loader", "css-loader", "postcss-loader"]
                },
                {
                    test: /\.scss$/,
                    use: ["vue-style-loader", "css-loader", "postcss-loader", "sass-loader"]
                },
                {
                    test: /\.png$/,
                    type: "asset/resource"
                },
                {
                    test: /\.svg$/,
                    type: "asset/resource"
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
                                    declaration: false
                                }
                            }
                        }
                    ],
                    exclude: /node_modules/
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
                                    jsx: "react-jsx"
                                }
                            }
                        }
                    ],
                    exclude: /node_modules\/(?!.*smit_gate_shared_dependency).*$/
                }
            ]
        }
    }

    if (is_production) {
        config.mode = "production"
        config.devtool = false
        ;(config.output.path = path.resolve(__base, "..", "deployment-app", "public", `smit_gate_${PACKAGE_NAME}`)), (config.output.publicPath = `/smit-gate-${PACKAGE_NAME}/`)
    } else {
        config.mode = "development"
        config.devtool = "inline-source-map"
        config.devServer = {
            static: "./dist",
            hot: true,
            port: 17101,
            webSocketServer: false,
            client: {
                // logging: "none"
            }
        }
    }

    return config
}
