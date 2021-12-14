module.exports = {
    "stories": [
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons": [
        {
            name: '@storybook/preset-scss',
            options: {
                cssLoaderOptions: {
                    modules: {
                        localIdentName: '[name]__[local]--[hash:base64:5]',
                    },
                }
            }
        },
        "@storybook/addon-links",
        "@storybook/addon-essentials"
    ],
    "framework": "@storybook/react",
    "core": {
        "builder": "webpack5"
    }
};
