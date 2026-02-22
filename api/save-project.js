import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const projects = await kv.get('projects') || [];
    const { id, title, desc, lang, color, tags, url, image } = req.body.project;
    
    if (id) {
      const index = projects.findIndex(p => p.id === id);
      if (index !== -1) projects[index] = { id, title, desc, lang, color, tags, url, image };
    } else {
      projects.push({ id: Date.now().toString(), title, desc, lang, color, tags, url, image });
    }
    
    await kv.set('projects', projects);
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save project' });
  }
}
