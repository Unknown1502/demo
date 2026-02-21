export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: req.body.image,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
      })
    });
    
    const data = await response.json();
    res.status(200).json({ url: data.secure_url });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
}
