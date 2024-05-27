import { corsHeaders } from "../lib/lib.ts";
import { Marked } from "npm:@ts-stack/markdown";
import { parseRSSFeed } from "./fetch.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

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
  const ENCODING = "utf-8";
  const BACKGROUND_COLOR = "#0C0C0C";
  const TEXT_COLOR = "#fff";
  const README_PATH = "README.md";
  const LINK_COLOR = "#002DCE";
  const MAX_WIDTH = "800px"; // Define the maximum width here
  const FONT_FAMILY = "Arial, sans-serif"; // Define the font family here
  const textDecoder = new TextDecoder(ENCODING);
  const readmeContent = await Deno.readFile(README_PATH);
  const decodedReadmeContent = textDecoder.decode(readmeContent);

  const htmlContent = Marked.parse(decodedReadmeContent);
  const domParser = new DOMParser();
  const parsedHtml = domParser.parseFromString(htmlContent, "text/html");
  if (!parsedHtml) {
    throw new Error(`Failed to parse the ${README_PATH} file.`);
  }
  const titleElement = parsedHtml.createElement("title");
  titleElement.textContent = "Reddit RSS API";
  parsedHtml.head.appendChild(titleElement);
  if (!parsedHtml) {
    throw new Error(`Failed to parse the ${README_PATH} file.`);
  }
  const styleElement = parsedHtml.createElement("style");
  styleElement.textContent = `
    body {
      background-color: ${BACKGROUND_COLOR};
      color: ${TEXT_COLOR};
      max-width: ${MAX_WIDTH};
      margin: auto;
      font-family: ${FONT_FAMILY};
    }
    a {
      color: ${LINK_COLOR};
      font-weight: bold;
      font-family: ${FONT_FAMILY};
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    code {
      background-color: #808080;
      padding-right: 5px;
      padding-left: 5px;
      border-radius: 8px;
    }
  `;

  parsedHtml.head.appendChild(styleElement);

  const metaTags = [
    { name: "title", content: "Reddit RSS API" },
    {
      name: "description",
      content:
        "An API for fetching Reddit posts from RSS feeds. It offers multiple endpoints to retrieve posts from one or more subreddits.",
    },
    { name: "keywords", content: "reddit rss, reddit api" },
    { name: "robots", content: "index, follow" },
    { httpEquiv: "Content-Type", content: "text/html; charset=utf-8" },
    { name: "language", content: "English" },
    { name: "author", content: "sametcn99" },
  ];

  for (const metaTag of metaTags) {
    const metaElement = parsedHtml.createElement("meta");

    if (metaTag.name) {
      metaElement.setAttribute("name", metaTag.name);
    }
    if (metaTag.httpEquiv) {
      metaElement.setAttribute("http-equiv", metaTag.httpEquiv);
    }
    metaElement.setAttribute("content", metaTag.content);
    parsedHtml.head.appendChild(metaElement);
  }
  return parsedHtml;
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
