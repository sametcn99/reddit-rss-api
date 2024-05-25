import { parseRSSFeed } from "./fetch.ts";
import { mergedSubreddits } from "./utils.ts";

export function handleFılterImages(data: ResponseData): ResponseData {
  data.items = data.items.filter(
    (item) => item.images !== undefined && item.images.length > 0
  );
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
  data: ResponseData[] | ResponseData | ExtractedItem
): Promise<ResponseData | ExtractedItem> {
  const { option, sort, filter, merge } = getQueryParams(url);

  if (option === "random") {
    data = await parseRSSFeed(feedUrl);
    if (filter === "image") {
      data = handleFılterImages(data);
    }
    data = handleRandomPost(data);
    return data;
  }
  if (sort) {
    data = await parseRSSFeed(feedUrl);
    data = handleSort(data, sort);
    return data;
  }
  if (filter === "image") {
    // check data type if it is ResponseData
    if ("feed" in data) {
      data = handleFılterImages(data);
      return data;
    }
  }
  if (!merge && !option && !sort && !filter) {
    data = await parseRSSFeed(feedUrl);
    return data;
  }
  return data as ResponseData | ExtractedItem;
}
