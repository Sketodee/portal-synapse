import connectDb from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { NextResponse } from "next/server";

export const POST = async (request: Request): Promise<NextResponse> => {
    try {
      // Parse request body
      const body = await request.json();

      console.log(body)
  
      // Connect to the database
      await connectDb();
  
      // Create and save a new product
    //   await BlogPost.create(body)
  
      return new NextResponse(
        JSON.stringify({ message: "Product added successfully"}),
        { status: 201 }
      );

    } catch (error: any) {
      console.log(error)
      return new NextResponse(JSON.stringify({message: "Error adding product: " }) ,{ status: 500 });
    }
  };