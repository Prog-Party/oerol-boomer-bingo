/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 14
  
  // Performance optimizations
  swcMinify: true, // Use SWC for faster minification
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.logs in production
  },
  
  // Reduce bundle analysis overhead
  experimental: {
    // Remove optimizeCss as it requires critters which causes issues
    optimizePackageImports: [
      '@azure/storage-blob',
      'react-confetti',
      'slugify'
    ]
  },
  
  // Output optimizations
  //output: 'standalone', // Generate smaller bundles
  
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    typescript: {
      // Ignore TypeScript errors during development builds for speed
      ignoreBuildErrors: false,
    },
    eslint: {
      // Ignore ESLint errors during development builds for speed
      ignoreDuringBuilds: false,
    }
  })
}

module.exports = nextConfig 