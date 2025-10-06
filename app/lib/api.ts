import { BlogPost } from '../types/blog';

// Get environment variables
const BLOG_ID = process.env.BLOG_ID || '1478326732546639430';
const API_KEY = process.env.API_KEY || 'AIzaSyDRCuZ03KwvSAR6Bqin6MsNQ4ZoQArrSho';

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${id}?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}