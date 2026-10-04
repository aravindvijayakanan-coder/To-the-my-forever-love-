import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defaultPersonalization } from './src/data/defaultPersonalization';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');
const DATA_FILE = path.resolve(DATA_DIR, 'personalization.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initialize default data file if not present
if (!fs.existsSync(DATA_FILE)) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultPersonalization, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to initialize personalization.json:', err);
  }
}

async function startServer() {
  const app = express();

  // Allow up to 50MB for uploading 12 high-resolution personal photos
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Static uploads directory
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Personalization API: Get saved data
  app.get('/api/personalization', (req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return res.json({ success: true, data: parsed });
      }
      return res.json({ success: true, data: defaultPersonalization });
    } catch (err: any) {
      console.error('Error reading personalization:', err);
      return res.status(500).json({ success: false, error: err.message, data: defaultPersonalization });
    }
  });

  // Personalization API: Save data
  app.post('/api/personalization', (req, res) => {
    try {
      const data = req.body;
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid data format' });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
      return res.json({ success: true, message: 'Personalization saved successfully', data });
    } catch (err: any) {
      console.error('Error saving personalization:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Photo Upload API (accepts base64 dataUrl or raw image binary)
  app.post('/api/upload-photo', (req, res) => {
    try {
      const { image, photoId, filename } = req.body;
      if (!image) {
        return res.status(400).json({ success: false, error: 'No image provided' });
      }

      // Check if image is base64 string
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let extension = 'jpg';

      if (matches && matches.length === 3) {
        const mime = matches[1];
        if (mime.includes('png')) extension = 'png';
        else if (mime.includes('webp')) extension = 'webp';
        else if (mime.includes('gif')) extension = 'gif';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        // Plain base64 or direct data
        buffer = Buffer.from(image, 'base64');
      }

      const safePhotoId = photoId || 'photo';
      const outputFilename = `photo_${safePhotoId}_${Date.now()}.${extension}`;
      const filePath = path.resolve(UPLOADS_DIR, outputFilename);

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${outputFilename}`;
      return res.json({ success: true, url: publicUrl, filename: outputFilename });
    } catch (err: any) {
      console.error('Error saving uploaded photo:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Reset to default
  app.post('/api/reset-personalization', (req, res) => {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultPersonalization, null, 2), 'utf8');
      return res.json({ success: true, message: 'Reset to default successful', data: defaultPersonalization });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware in dev or static files in production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Romantic Birthday Experience server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
