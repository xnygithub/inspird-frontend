import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/signup',
        destination: '/login'
      },
      {
        source: '/forgot-password',
        destination: '/login'
      },
      {
        source: '/change-password',
        destination: '/login'
      },
      {
        source: '/settings',
        destination: '/settings/profile'
      },
    ];
  },

  images: {
    domains: [
      "i.pinimg.com",
      "xtuvouuyblwehrqsmhqb.supabase.co",
      "images.squarespace-cdn.com"
    ],
  },
};

export default nextConfig;
