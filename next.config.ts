import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "img.pokemondb.net",
        port: "",
        pathname: "/artwork/avif/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "projectpokemon.org",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "unpkg.com",
        port: "",
        pathname: "/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
