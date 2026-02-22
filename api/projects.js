import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const projects = await kv.get('projects') || [];
    return res.status(200).json(projects);
  } catch (error) {
    console.error('projects.js error:', error);
    return res.status(500).json({ error: 'Failed to fetch projects: ' + error.message });
  }
}
