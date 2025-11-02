// TypeScript type declaration for Next.js configuration object
// This ensures type safety and IDE autocomplete for the config
/** @type {import('next').NextConfig} */

// Initialize the Next.js configuration object with build and runtime settings
const nextConfig = {
  // ESLint configuration section
  // Prevents ESLint errors from blocking the build process during development
  // This allows the build to complete even if there are linting issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration section
  // Allows the build to proceed even if there are TypeScript type errors
  // Useful for development but should be fixed in production
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization configuration
  // Disables Next.js automatic image optimization
  // Set to true when using external image optimization services or for development
  images: {
    unoptimized: true,
  },
}

// Export the configuration object as the default export
// This configuration is loaded by Next.js at build and runtime
export default nextConfig
