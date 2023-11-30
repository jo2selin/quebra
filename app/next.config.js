/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.S3_UPLOAD_BUCKET}.s3.amazonaws.com`,
        // port: '',
        // pathname: '/account123/**',
      },
      {
        protocol: "https",
        hostname: `${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com`,
      },
      {
        protocol: "https",
        hostname: `hauteoldassets.blob.core.windows.net`,
      },
      {
        protocol: "https",
        hostname: `cdn.sanity.io`,
      },
    ],
  },
  // i18n: {
  // These are all the locales you want to support in
  // your application
  // locales: ["fr"],
  // defaultLocale: "fr",
  // },
};

module.exports = nextConfig;
