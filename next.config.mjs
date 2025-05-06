import MiniCssExtractPlugin from "mini-css-extract-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Only run on the client side
    if (!isServer) {
      config.plugins.push(new MiniCssExtractPlugin());
    }
    return config;
  },
};

export default nextConfig;
