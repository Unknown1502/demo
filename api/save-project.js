import { kv } from '@vercel/kv';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized — wrong password' });
  }

  try {
    const projects = await kv.get('projects') || [];
    const { id, title, desc, lang, color, tags, url, image } = req.body.project;

    if (id) {
      const index = projects.findIndex(p => p.id === id);
      if (index !== -1) {
        projects[index] = { id, title, desc, lang, color, tags, url, image };
      } else {
        return res.status(404).json({ error: 'Project not found' });
      }
    } else {
      projects.push({ id: Date.now().toString(), title, desc, lang, color, tags, url, image });
    }

    await kv.set('projects', projects);
    return res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error('save-project.js error:', error);
    return res.status(500).json({ error: 'Failed to save project: ' + error.message });
  }
}
