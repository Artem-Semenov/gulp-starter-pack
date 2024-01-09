
export default (env) => {
    return {
        mode: env.mode === "development" ? "development" : "production",
        devtool: env.mode === "development" ? "source-map" : false,
        entry: {
            index: "./src/js/index.js",
            // about: "./src/js/about.js",
            // contacts: './src/js/contacts.js',
        },
        output: {
            filename: "[name].bundle.js",
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
        optimization: {
            minimize: env.mode === "production",
        },
    };
}