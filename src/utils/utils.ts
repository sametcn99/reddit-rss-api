import { corsHeaders } from "../lib/lib.ts";

/**
 * Logs the request body if it exists.
 * @param req - The request object.
 */
export async function logRequestBody(req: Request) {
  if (req.body) {
    const body = await req.text();
    console.log(`Body: ${body}`);
  }
}

/**
 * Sends a bad request response.
 * @returns {Response} The response object with a 400 status code and appropriate headers.
 */
export function sendBadRequestResponse(): Response {
  return new Response(`Bad request`, {
    status: 400,
    headers: {
      "Content-Type": "text/plain",
      ...corsHeaders,
    },
    statusText: "Bad Request",
  });
}
