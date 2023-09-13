/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      `${process.env.S3_UPLOAD_BUCKET}.s3.amazonaws.com`,
      `${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com`,
      `hauteoldassets.blob.core.windows.net`,
      `cdn.sanity.io`,
    ],
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["fr"],
    defaultLocale: "fr",
  },
};

module.exports = nextConfig;
