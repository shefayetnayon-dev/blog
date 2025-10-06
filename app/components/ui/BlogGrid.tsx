'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '../../types/blog';
import { getBlogPosts } from '../../lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogGrid() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to extract the first image from blog content
  const extractFirstImage = (content: string) => {
    // Try to find an image in the content
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    
    if (match && match[1]) {
      return match[1];
    }
    
    // If no image found in content, try to get it from Blogger's default image structure
    // Blogger sometimes stores images in a different way
    const mediaRegex = /<a[^>]+href="([^">]+\.(jpg|jpeg|png|gif|webp))"[^>]*>/;
    const mediaMatch = content.match(mediaRegex);
    
    if (mediaMatch && mediaMatch[1]) {
      return mediaMatch[1];
    }
    
    // Return a placeholder if no image is found
    return null;
  };

  // Function to clean HTML content and convert to plain text
  const cleanHtmlContent = (html: string, maxLength = 150) => {
    if (typeof window === 'undefined') {
      // Server-side rendering fallback
      return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().substring(0, maxLength) + '...';
    }
    
    // Create a temporary div element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Get the text content
    let text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Remove extra whitespace and &nbsp;
    text = text.replace(/\s+/g, ' ').replace(/&nbsp;/g, ' ').trim();
    
    // Truncate if needed
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
    }
    
    return text;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded max-w-md mx-auto">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-12 text-center"
      >
        Recent Posts
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.slice(0, 6).map((post, index) => {
          const imageUrl = extractFirstImage(post.content);
          
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // If image fails to load, hide it
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {cleanHtmlContent(post.content)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.published).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <Link href={`/blogs/${post.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm"
                    >
                      Read More
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center mt-12"
      >
        <Link href="/blogs">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border border-black dark:border-white rounded-full"
          >
            View All Blogs
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}