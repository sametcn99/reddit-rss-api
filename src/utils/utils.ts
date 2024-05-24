import { corsHeaders } from "../lib/lib.ts";
import { Marked } from "npm:@ts-stack/markdown";
import { parseRSSFeed } from "./fetch.ts";

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

/**
 * Sends an OK response with the provided data.
 *
 * @param data - The data to be sent in the response.
 * @returns The response object.
 */
export function sendOKResponse(
  data: ExtractedItem | ResponseData[] | ResponseData | string
): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
    status: 200,
    statusText: "OK",
  });
}

/**
 * Retrieves the content of the README.md file and parses it into markup.
 * @returns The parsed markup of the README.md file.
 */
export async function getReadme() {
  const decoder = new TextDecoder("utf-8");
  const markdown = decoder.decode(await Deno.readFile("README.md"));
  const markup = Marked.parse(markdown);
  return markup;
}

export async function mergedSubreddits(feedUrls: string[], pathnames: string) {
  const subreddits = pathnames.split("+");
  let data: ResponseData = {
    title: `Merged feed for ${subreddits.join(" + ")}`,
    lastBuildDate: new Date(),
    link: `https://reddit-rss-api.deno.dev/r/${pathnames}`,
    feedUrl: "https://reddit-rss-api.deno.dev/",
    items: [],
  };
  for (const feedUrl of feedUrls) {
    const feedData = await parseRSSFeed(feedUrl);
    data = {
      ...data,
      items: data.items.concat(feedData.items),
    };
  }
  return data;
}
