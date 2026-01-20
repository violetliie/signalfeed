/**
 * Health check endpoint for monitoring
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ 
      ok: true,
      service: 'signalfeed',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    }
  );
};
