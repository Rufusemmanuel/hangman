export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  const rawBody = req.body;
  let parsedBody = rawBody;
  if (typeof rawBody === 'string') {
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      parsedBody = rawBody;
    }
  }

  // Best-effort logging for visibility
  console.log('miniapp webhook', {
    event: req.headers['x-event-type'] ?? null,
    body: parsedBody,
  });

  res.status(200).json({ ok: true });
}
