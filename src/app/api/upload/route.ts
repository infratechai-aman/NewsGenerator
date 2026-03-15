import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.png';
    const filename = `${type}-${uuidv4()}${ext}`;
    
    const useFirebase = !!process.env.FIREBASE_SERVICE_ACCOUNT;

    if (useFirebase) {
      // Production: Upload to Firebase Storage
      const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      const bucket = adminStorage.bucket(bucketName);
      const destinationPath = `assets/${filename}`;
      const fileRef = bucket.file(destinationPath);
      
      await fileRef.save(buffer, {
        metadata: {
          contentType: file.type || 'image/png',
        },
        public: true,
      });
      
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileRef.name}`;

      return NextResponse.json({
        url: publicUrl,
        name: file.name,
        type,
      });
    } else {
      // Local Fallback: Upload to public/uploads
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (dirError) {
        console.warn('Upload dir creation error (might already exist):', dirError);
      }
      
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);

      return NextResponse.json({
        url: `/uploads/${filename}`,
        name: file.name,
        type,
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
