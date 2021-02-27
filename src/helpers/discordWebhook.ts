import fetch, { Response } from 'node-fetch';

function discordWebhook(url: string, body: Record<string, unknown>): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export default discordWebhook;
