import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://default:gBQEi3EW3mfO6X42ooVuslyWTgQXz1U1@redis-15395.c85.us-east-1-2.ec2.cloud.redislabs.com:15395';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export default async function handler(req, res) {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = createClient({ url: REDIS_URL });
  client.on('error', err => console.error('Redis error:', err));

  try {
    await client.connect();
    const raw = await client.get('projects');
    const projects = raw ? JSON.parse(raw) : [];
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

    await client.set('projects', JSON.stringify(projects));
    return res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error('save-project.js error:', error);
    return res.status(500).json({ error: 'Failed to save project' });
  } finally {
    await client.disconnect();
  }
}
