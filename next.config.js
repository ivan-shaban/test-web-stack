/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    // split dev \ prod builds, because they may work at the same time
    distDir: process.env.NODE_ENV === 'production'
        ? 'build'
        : '.next',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/users',
                permanent: true,
            },
        ];
    },
};
