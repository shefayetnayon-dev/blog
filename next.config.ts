/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', '1.bp.blogspot.com', '2.bp.blogspot.com', '3.bp.blogspot.com', 'media.prothomalo.com','www.mathabhanga.com'],
  },
  env: {
    BLOG_ID: process.env.BLOG_ID,
    API_KEY: process.env.API_KEY,
  },
}

module.exports = nextConfig
