import connectDb from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { BlogPostResponse} from "@/types/appTypes";
import { NextResponse } from "next/server";

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    // Parse request body
    const body = await request.json();

    console.log(body)

    // Connect to the database
    await connectDb();

    // Create and save a new product
    await BlogPost.create(body)

    return new NextResponse(
      JSON.stringify({ message: "Post created successfully" }),
      { status: 201 }
    );

  } 
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.log(error)
    return new NextResponse(JSON.stringify({ message: "Error creating blog post: " }), { status: 500 });
  }
};

export const GET = async (request: Request): Promise<NextResponse> => {

  const { searchParams } = new URL(request.url);
  const pageNumber = parseInt(searchParams.get("page") || "1", 10);
  const filter: string = searchParams.get("filter") || "";
  const search = searchParams.get("search") || "";

  const pageSize = 9; // Number of items per page
  const skip = (pageNumber - 1) * pageSize;

  console.log(searchParams)
  try {
    // Connect to the database
    await connectDb();

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    // If there's a filter and it's not 'AllPosts', filter by the tag/status/etc.
    if (filter) {
      query.status = filter;
    }

    // If there's a search term, look for matches in title or tag
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }, // or $elemMatch if tag is array
      ];
    }

    const count = await BlogPost.countDocuments(query);

    const blogPosts = await BlogPost.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(pageSize);

    // Convert MongoDB ObjectId to string for each product
    const blogPostData : BlogPostResponse[] = blogPosts.map(blogPost => ({
      ...blogPost.toObject(), // Convert to plain object
      _id: blogPost._id.toString(), // Convert ObjectId to string
    }));

    console.log(count)

    return new NextResponse(
      JSON.stringify({
        data: blogPostData,
        totalCount: count,
      }),
      { status: 200 }
    );
    
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error)
    return new NextResponse(JSON.stringify({ message: "Error fetching blog posts: " }), { status: 500 });
  }
}