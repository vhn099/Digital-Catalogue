/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // output: 'standalone',
    distDir: 'dist', // Move the export process to folder custom name instead "out"
    trailingSlash: true, // The trailingSlash setting tells Next.js to include a trailing slash in the URL of the exported HTML files. This can help fix issues with routing and page loading.
};

export default nextConfig;
