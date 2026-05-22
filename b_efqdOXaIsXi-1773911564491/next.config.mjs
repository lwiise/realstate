/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Serve photos exactly as uploaded — no resizing, re-encoding, or recompression.
    // (next/image optimization would convert to WebP/AVIF and recompress, changing quality.)
    // Videos are unaffected either way since they render via <video>, not next/image.
    unoptimized: true,
  },
}

export default nextConfig
