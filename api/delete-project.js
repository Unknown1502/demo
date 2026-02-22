import { kv } from '@vercel/kv';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized — wrong password' });
  }

  try {
    const projects = await kv.get('projects') || [];
    const filtered = projects.filter(p => p.id !== req.body.id);
    await kv.set('projects', filtered);
    return res.status(200).json({ success: true, projects: filtered });
  } catch (error) {
    console.error('delete-project.js error:', error);
    return res.status(500).json({ error: 'Failed to delete project: ' + error.message });
  }
}
