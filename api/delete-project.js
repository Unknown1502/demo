import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
  
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const projects = await kv.get('projects') || [];
    const filtered = projects.filter(p => p.id !== req.body.id);
    await kv.set('projects', filtered);
    res.status(200).json({ success: true, projects: filtered });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
}
