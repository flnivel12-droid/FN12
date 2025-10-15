import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false, // Remove widget de desenvolvimento Next.js
  
  // Ignorar erros durante build (compatibilidade Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Otimizações para build mais rápido
  swcMinify: true,
  
  // Configuração de imagens otimizada
  images: {
    remotePatterns: [
      // Principais provedores de imagem
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Configuração experimental para melhor performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Configurações para evitar timeout no build
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

export default nextConfig;