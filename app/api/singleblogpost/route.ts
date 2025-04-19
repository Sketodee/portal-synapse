import connectDb from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { BlogPostResponse } from "@/types/appTypes";
import { NextResponse } from "next/server";

export const GET = async (request: Request): Promise<NextResponse> => {

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  console.log(searchParams)
  try {
    // Connect to the database
    await connectDb();

    const query: any = {};


    const blogPost = await BlogPost.findById(id)
      .sort({ createdAt: -1, _id: -1 })

      const blogPostData: BlogPostResponse = {
        ...blogPost.toObject(),
        _id: blogPost._id.toString(),
      };
      


    return new NextResponse(
      JSON.stringify({
        data: blogPostData,
      }),
      { status: 200 }
    );
    

  } catch (error: any) {
    console.log(error)
    return new NextResponse(JSON.stringify({ message: "Error fetching blog posts: " }), { status: 500 });
  }
}

export const DELETE = async (request: Request): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'Blog post ID is required' }),
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await connectDb();

    // Attempt to delete the blog post by ID
    const result = await BlogPost.findByIdAndDelete(id);

    if (!result) {
      return new NextResponse(
        JSON.stringify({ message: 'Blog post not found' }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: 'Blog post deleted successfully' }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Error deleting blog post' }),
      { status: 500 }
    );
  }
};

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const body = await request.json();
    const {
      _id,
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      readTime,
      seoTitle,
      seoDescription,
      status,
    } = body;

    if (!_id) {
      return new NextResponse(
        JSON.stringify({ message: "Post ID is required" }),
        { status: 400 }
      );
    }

    await connectDb();

    const updatedPost = await BlogPost.findByIdAndUpdate(
      _id,
      {
        title,
        excerpt,
        content,
        featuredImage,
        category,
        tags,
        readTime,
        seoTitle,
        seoDescription,
        status,
      },
      { new: true }
    );

    if (!updatedPost) {
      return new NextResponse(
        JSON.stringify({ message: "Blog post not found" }),
        { status: 404 }
      );
    }

    const blogPostData = {
      ...updatedPost.toObject(),
      _id: updatedPost._id.toString(),
    };

    return new NextResponse(
      JSON.stringify({
        data: blogPostData,
        message: "Blog post updated successfully",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};