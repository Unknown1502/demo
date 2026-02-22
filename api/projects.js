import { createClient } from 'redis';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const client = createClient({ url: process.env.REDIS_URL });
  try {
    await client.connect();
    const raw = await client.get('projects');
    const projects = raw ? JSON.parse(raw) : [];
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  } finally {
    await client.disconnect();
  }
}
