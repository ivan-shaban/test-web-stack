/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    // split dev \ prod builds, because they may work at the same time
    distDir: process.env.NODE_ENV === 'production'
        ? 'build'
        : '.next',
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
