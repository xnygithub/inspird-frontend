import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'pinit-images-bucket.s3.eu-west-1.amazonaws.com', "i.pinimg.com"],
  },
  /* config options here */
};

export default nextConfig;
