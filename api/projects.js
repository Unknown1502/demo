import { createClient } from 'redis';

const REDIS_URL = 'rediss://default:gBQEi3EW3mfO6X42ooVuslyWTgQXz1U1@redis-15395.c85.us-east-1-2.ec2.cloud.redislabs.com:15395';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const client = createClient({
    url: REDIS_URL,
    socket: { tls: true, rejectUnauthorized: false, connectTimeout: 8000 }
  });
  client.on('error', err => console.error('Redis error:', err));

  try {
    await client.connect();
    const raw = await client.get('projects');
    const projects = raw ? JSON.parse(raw) : [];
    return res.status(200).json(projects);
  } catch (error) {
    console.error('projects.js error:', error);
    return res.status(500).json({ error: 'Failed to fetch projects: ' + error.message });
  } finally {
    await client.disconnect();
  }
}
