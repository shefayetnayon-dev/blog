'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost } from '../../types/blog';
import { getBlogPosts } from '../../lib/api';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function SearchResults({ 
  searchQuery, 
  onClose 
}: { 
  searchQuery: string; 
  onClose: () => void;
}) {
  const [results, setResults] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchPosts = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const posts = await getBlogPosts();
        const filteredResults = posts.filter(post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filteredResults);
      } catch (error) {
        console.error('Error searching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const timer = setTimeout(() => {
      searchPosts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <AnimatePresence>
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h3 className="font-medium">Search Results</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <X size={18} />
            </button>
          </div>
          
          {loading ? (
            <div className="p-4 text-center">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found for &quot;{searchQuery}&quot;
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {results.slice(0, 5).map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/blogs/${post.id}`}
                    onClick={onClose}
                    className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    <h4 className="font-medium mb-1">{post.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                  </Link>
                ))}
              </div>
              
              {results.length > 5 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-800 text-center">
                  <Link 
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={onClose}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all results ({results.length})
                  </Link>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}