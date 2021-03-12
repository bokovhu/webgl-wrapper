const path = require("path");
const webpack = require("webpack");

module.exports = env => {
    return {
        entry: path.resolve(__dirname, "src/index.ts"),
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "wglw.js",
            library: "WebGLWrapper",
            libraryTarget: "umd"
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [".json", ".js", ".ts"]
        },
        devtool: env.development ? "inline-source-map" : false,
        externals: {
            "gl-matrix": "gl-matrix"
        }
    };
};
