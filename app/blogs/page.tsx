import { getBlogPosts } from '../lib/api';
import BlogCard from '../components/ui/BlogCard';

export default async function BlogsPage() {
  // Add error handling
  let posts = [];
  try {
    posts = await getBlogPosts();
  } catch (error) {
    console.error('Error in BlogsPage:', error);
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">All Blogs</h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl">No blog posts found.</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Please check back later for new content.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}