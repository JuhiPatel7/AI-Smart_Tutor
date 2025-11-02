// TypeScript type declaration for PostCSS configuration
// This provides type safety for the configuration object
/** @type {import('postcss-load-config').Config} */

// Initialize the PostCSS configuration object
// PostCSS is a tool for transforming CSS with JavaScript plugins
const config = {
  // plugins object contains all PostCSS plugins and their configuration
  // Each key is a plugin name, and the value is its configuration options
  plugins: {
    // Tailwind CSS PostCSS plugin
    // This processes Tailwind CSS utility classes and generates CSS
    // Empty object {} means using default Tailwind configuration
    '@tailwindcss/postcss': {},
  },
}

// Export the configuration object as the default export
// This configuration is loaded by PostCSS at build time
export default config
