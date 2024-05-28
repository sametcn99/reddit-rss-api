import { corsHeaders } from "../lib/lib.ts";
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
export function sendBadRequestResponse(error?:string): Response {
  return new Response(error , {
    status: 400,
    headers: {
      "Content-Type": "text/plain",
      ...corsHeaders,
    },
    statusText: error,
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

export async function mergedSubreddits(
  feedUrls: string[],
  pathnames: string
): Promise<ResponseData> {
  try {
    const subreddits = pathnames.split("+");
    let data: ResponseData = {
      title: `Merged feed for ${subreddits.join(" + ")}`,
      lastBuildDate: new Date(),
      link: `https://reddit-rss-api.deno.dev/r/${pathnames}`,
      feedUrl: "https://reddit-rss-api.deno.dev/",
      items: [],
    };

    const feedDataPromises = feedUrls.map((feedUrl) => parseRSSFeed(feedUrl));
    const feedDataArray = await Promise.all(feedDataPromises);
    for (const feedData of feedDataArray) {
      data = {
        ...data,
        items: data.items.concat(feedData.items),
      };
    }
    data.itemsLength = data.items.length;
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch the RSS feed.`);
  }
}

export function isNumber(value?: string | number): boolean
{
   return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}