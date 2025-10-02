import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'pinit-images-bucket.s3.eu-west-1.amazonaws.com', "i.pinimg.com", "t3.ftcdn.net"],
  },
  /* config options here */
};

export default nextConfig;
