/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["apiforapp.link"],

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
