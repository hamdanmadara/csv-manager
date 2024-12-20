// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  console.log("testttttttt")

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only CSV files are allowed' },
        { status: 400 }
      );
    }

    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      // Create a unique filename
      const uniqueFilename = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadsDir, uniqueFilename);

      // Convert file to buffer and write
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Write the file
      await writeFile(filePath, buffer);
      console.log("testtttt12")

      return NextResponse.json({
        success: true,
        fileName: file.name,
        savedAs: uniqueFilename,
        size: file.size
      });

    } catch (error) {
      console.error('Error saving file:', error);
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

// Optional: Configure for larger files
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
};