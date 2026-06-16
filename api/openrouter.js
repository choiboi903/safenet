export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: { message: 'Method not allowed.' } });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: { message: 'OPENROUTER_API_KEY is not configured.' } });
  }

  try {
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': request.headers.origin || 'https://safenet.local',
        'X-Title': 'SafeNet Scanner'
      },
      body: JSON.stringify(request.body)
    });

    const payload = await openRouterResponse.json();
    return response.status(openRouterResponse.status).json(payload);
  } catch (error) {
    return response.status(500).json({ error: { message: error.message || 'AI proxy failed.' } });
  }
}
