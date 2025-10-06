'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '../../types/blog';
import { getBlogPost } from '../../lib/api';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';

export default function SinglePost() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableOfContents, setTableOfContents] = useState<{ id: string; title: string }[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const blogPost = await getBlogPost(postId);
        setPost(blogPost);
        
        // Extract featured image
        if (blogPost) {
          const image = extractFirstImage(blogPost.content);
          setFeaturedImage(image);
          
          // Generate table of contents (simplified version)
          const content = blogPost.content;
          const headings = content.match(/<h[2-3][^>]*>(.*?)<\/h[2-3]>/g) || [];
          const toc = headings.map((heading, index) => {
            const title = heading.replace(/<[^>]*>/g, '');
            return { id: `heading-${index}`, title };
          });
          setTableOfContents(toc);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-2 w-5/6"></div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Post not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-xl relative overflow-hidden">
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              onError={(e) => {
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
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center mb-6 text-gray-600 dark:text-gray-400">
            <span>By {post.author.displayName}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(post.published), 'MMMM d, yyyy')}</span>
          </div>
          
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
            <nav>
              <ul className="space-y-2">
                {tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </motion.div>
      </div>
    </div>
  );
}