'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '../../types/blog';
import { getBlogPosts } from '../../lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogSlider() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  // Function to extract the first image from blog content
  const extractFirstImage = (content: string) => {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    
    if (match && match[1]) {
      return match[1];
    }
    
    const mediaRegex = /<a[^>]+href="([^">]+\.(jpg|jpeg|png|gif|webp))"[^>]*>/;
    const mediaMatch = content.match(mediaRegex);
    
    if (mediaMatch && mediaMatch[1]) {
      return mediaMatch[1];
    }
    
    return null;
  };

  // Function to clean HTML content and convert to plain text
  const cleanHtmlContent = (html: string, maxLength = 200) => {
    if (typeof window === 'undefined') {
      // Server-side rendering fallback
      return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().substring(0, maxLength) + '...';
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    let text = tempDiv.textContent || tempDiv.innerText || '';
    text = text.replace(/\s+/g, ' ').replace(/&nbsp;/g, ' ').trim();
    
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
    }
    
    return text;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const nextSlide = () => {
    setImgError(false);
    setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setImgError(false);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
  };

  const handleImageError = () => {
    setImgError(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
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

  const currentPost = posts[currentIndex];
  const imageUrl = extractFirstImage(currentPost.content);

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-96 overflow-hidden rounded-xl"
      >
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gray-100 dark:bg-gray-900"
        >
          <div className="h-full flex flex-col md:flex-row">
            <div className="md:w-1/2 h-1/2 md:h-full relative">
              {imageUrl && !imgError ? (
                <Image
                  src={imageUrl}
                  alt={currentPost.title}
                  fill
                  className="object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-300 dark:bg-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">{currentPost.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-4">
                {cleanHtmlContent(currentPost.content)}
              </p>
              <Link href={`/blogs/${currentPost.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full w-fit"
                >
                  Read More
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-black p-2 rounded-full shadow-md"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-black p-2 rounded-full shadow-md"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setImgError(false);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}