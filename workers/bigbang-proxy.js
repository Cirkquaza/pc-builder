export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders() });
    }

    const auth = request.headers.get('authorization');
    if (env.PROXY_TOKEN && auth !== `Bearer ${env.PROXY_TOKEN}`) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders() });
    }

    const body = await request.text();

    const upstream = await fetch('https://www.bigbang.hr/api/nuxtapi/catalog/products/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; PCBuilder/1.0)',
        'Referer': 'https://www.bigbang.hr/',
      },
      body,
    });

    const responseBody = await upstream.text();

    return new Response(responseBody, {
      status: upstream.status,
      headers: {
        ...corsHeaders(),
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      },
    });
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
