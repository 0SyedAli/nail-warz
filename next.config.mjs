/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["predemo.site"],

    },
    async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
