/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: false,
    optimizeFonts: false,
    swcMinify: true,

    experimental: {
        serverComponentsExternalPackages: ['argon2']
    },

    webpack: (config) => {
        config.experiments = { ...config.experiments, topLevelAwait: true }
        return config;
    }
}

module.exports = nextConfig
