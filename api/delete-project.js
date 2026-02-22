import { createClient } from 'redis';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = createClient({ url: process.env.REDIS_URL || 'redis://default:gBQEi3EW3mfO6X42ooVuslyWTgQXz1U1@redis-15395.c85.us-east-1-2.ec2.cloud.redislabs.com:15395' });
  try {
    await client.connect();
    const raw = await client.get('projects');
    const projects = raw ? JSON.parse(raw) : [];
    const filtered = projects.filter(p => p.id !== req.body.id);
    await client.set('projects', JSON.stringify(filtered));
    res.status(200).json({ success: true, projects: filtered });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete project' });
  } finally {
    await client.disconnect();
  }
}
