import { parseRSSFeed } from "./fetch.ts";
import { mergedSubreddits } from "./utils.ts";
import { constrsuctMergedFeedUrls } from "./validators.ts";

export function handleFılterImages(data: ResponseData): ResponseData {
  data.items = data.items.filter((item) => item.images.length > 0);
  data.itemsLength = data.items.length;
  return data;
}

export function handleRandomPost(data: ResponseData): ExtractedItem {
  const randomIndex = Math.floor(Math.random() * data.items.length);
  const randomPost = data.items[randomIndex];
  return randomPost;
}

export function handleSort(data: ResponseData, sort: string): ResponseData {
  data.items = data.items.sort((a, b) => {
    if (sort === "asc" || sort === undefined) {
      return a.isoDate > b.isoDate ? 1 : -1;
    } else {
      // sort === "desc"
      return a.isoDate < b.isoDate ? 1 : -1;
    }
  });
  return data;
}

export function handleMerge(feedUrls: string[], path: string) {
  return mergedSubreddits(feedUrls, path);
}

export function getQueryParams(url: URL): {
  option: string | null;
  sort: string | null;
  filter: string | null;
  merge: string | null;
} {
  const option = url.searchParams.get("option");
  const sort = url.searchParams.get("sort");
  const filter = url.searchParams.get("filter");
  const merge = url.searchParams.get("merge");
  return { option, sort, filter, merge };
}

export async function handleResponse(
  url: URL,
  feedUrl: string,
  pathnames: string[]
): Promise<ResponseData | ExtractedItem> {
  const { option, sort, filter, merge } = getQueryParams(url);

  let data: ResponseData | ExtractedItem;

  data = {
    title: "",
    lastBuildDate: new Date(),
    link: "",
    feedUrl: "",
    items: [],
    itemsLength: 0,
    feed: {
      title: "",
      lastBuildDate: new Date(),
      link: "",
      feedUrl: "",
      items: [],
    },
  };

  if (merge === "true") {
    const feedUrls = constrsuctMergedFeedUrls(pathnames[1]);
    data = await mergedSubreddits(feedUrls, pathnames[1]);
  } else if (merge !== "true" && merge !== null && merge !== "false") {
    throw new Error("Invalid merge option. Use 'true' as merge option.");
  } else if (merge === "false" || merge === null) {
    data = await parseRSSFeed(feedUrl);
  }
  if (sort) {
    data = handleSort(data, sort);
  } else if (sort !== "asc" && sort !== "desc" && sort !== null) {
    throw new Error("Invalid filter option. Use 'image' as filter option.");
  }
  if (filter === "image") {
    data = handleFılterImages(data as ResponseData);
  } else if (filter !== "image" && filter !== null) {
    throw new Error("Invalid filter option. Use 'image' as filter option.");
  }
  if (option === "random") {
    data = handleRandomPost(data);
  } else if (option !== "random" && option !== null) {
    throw new Error("Invalid option. Use 'random' as option.");
  }
  return data as ResponseData | ExtractedItem;
}
