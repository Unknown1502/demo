export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dgt7a3opq';
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'CLOUDINARY_UPLOAD_PRESET';

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    // Use URLSearchParams (application/x-www-form-urlencoded) — accepted by
    // Cloudinary for unsigned uploads, avoids multipart boundary issues in
    // serverless environments.
    const params = new URLSearchParams();
    params.append('file', req.body.image);          // base64 data-URI
    params.append('upload_preset', uploadPreset);

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      console.error('Cloudinary error:', data);
      return res.status(500).json({ error: data.error?.message || 'Upload failed' });
    }

    res.status(200).json({ url: data.secure_url });
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}
