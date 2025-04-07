import { PostStatus } from "@/types/appTypes";
import mongoose from "mongoose";

interface IBlogPost extends Document {
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    category: 'Technology' | 'Business' | 'Health' | 'Lifestyle' | 'Travel';
    tags: string;
    readTime: string;
    seoTitle: string;
    seoDescription: string;
    status: PostStatus ;
  }


  const blogPostSchema = new mongoose.Schema<IBlogPost>(
    {
      title: { type: String, required: true },
      excerpt: { type: String, required: true },
      content: { type: String, required: true },
      featuredImage: { type: String, required: true },
      category: { type: String, required: true },
      tags: { type: String, required: false },
      readTime: { type: String, required: false },
      seoTitle: { type: String, required: false },
      seoDescription: { type: String, required: false },
      status: {type: String, required: true },
    },
    {
      timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
  );
  
  // Create and export the model if in a module environment
  const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
  
  export default BlogPost;
  