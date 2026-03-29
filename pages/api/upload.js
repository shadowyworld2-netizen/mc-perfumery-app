import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      filename: (name, ext, part, form) => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `${timestamp}-${random}${ext}`;
      },
    });

    // Parse the form
    const [fields, files] = await form.parse(req);

    // Check if file was uploaded
    if (!files.file || files.file.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = files.file[0];

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      // Clean up the uploaded file
      await fs.unlink(file.filepath);
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' });
    }

    // Generate the public URL
    const filename = path.basename(file.filepath);
    const imageUrl = `/uploads/${filename}`;

    res.status(200).json({
      success: true,
      url: imageUrl,
      filename: filename
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
}