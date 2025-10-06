import { getBlogPosts } from '../lib/api';
import BlogCard from '../components/ui/BlogCard';

export default async function BlogsPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">All Blogs</h1>
      
      {posts.length === 0 ? (
        <p className="text-center">No blog posts found.</p>
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