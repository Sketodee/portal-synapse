import { NextRequest, NextResponse } from 'next/server';

interface CloudinaryResponse {
  secure_url: string;
  // Include other Cloudinary response fields if needed
}

export async function POST(req: NextRequest) {
  try {
    // Check if the request has the correct content type
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Request must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Parse the form data from the request
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/drrbebmby/upload';
    const cloudinaryPreset = 'wifofnph';

    // Upload files to Cloudinary
    const uploadPromises = files.map(async (file) => {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', cloudinaryPreset);

      const response = await fetch(cloudinaryUploadUrl, {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${file.name}`);
      }

      const data = await response.json() as CloudinaryResponse;
      return data.secure_url; // Get the file URL from Cloudinary response
    });

    const fileUrls = await Promise.all(uploadPromises); // Wait for all uploads to complete

    return NextResponse.json({
      success: true,
      message: 'Images uploaded successfully',
      data: fileUrls,
    });
  } catch (error) {
    console.error('Error uploading images:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to upload image files. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}