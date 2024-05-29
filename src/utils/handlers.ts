import { parseRSSFeed } from "./fetch.ts";
import { isNumber, mergedSubreddits } from "./utils.ts";
import { constrsuctMergedFeedUrls } from "./validators.ts";

export function handleFilter(data: ResponseData, filter: string): ResponseData {
  const filterArr = filter.toLocaleLowerCase().split(" ");
  filterArr.forEach((filter) => {
    if (filter === "image") {
      data.items = data.items.filter((item) => item.images.length > 0);
    } else if(filter === "video") {
      data.items = data.items.filter((item) => item.videos.length > 0);
    } else {
      throw new Error("Invalid filter option. Use 'image' as filter option.");
    }
  });
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
    } else if (sort === "desc") {
      return a.isoDate < b.isoDate ? 1 : -1;
    } else if (sort === "mixed") {
      return Math.random() - 0.5;
    } else {
      throw new Error(
        "Invalid sort option. Use 'asc', 'desc' or 'mixed' as sort option."
      );
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
  count: number | null;
} {
  const option = url.searchParams.get("option");
  const sort = url.searchParams.get("sort");
  const filter = url.searchParams.get("filter");
  const merge = url.searchParams.get("merge");
  let count = url.searchParams.get("count") as string | number | null;
  if (count !== null) {
    if (isNumber(count)) {
      count = Number(count);
    } else {
      throw new Error("Count must be a number.");
    }
  }
  return { option, sort, filter, merge, count };
}

export async function handleResponse(
  url: URL,
  feedUrl: string,
  pathnames: string[]
): Promise<ResponseData | ExtractedItem> {
  const { option, sort, filter, merge, count } = getQueryParams(url);

  let data: ResponseData | ExtractedItem;
  data = {
    title: "",
    lastBuildDate: new Date(),
    link: "",
    feedUrl: "",
    items: [],
    itemsLength: 0,
  };
  if (!option && !sort && !filter && !merge && !count) {
    data = await parseRSSFeed(feedUrl);
    return data;
  }

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
  } else if (
    sort !== "asc" &&
    sort !== "desc" &&
    sort !== "mixed" &&
    sort !== null
  ) {
    throw new Error("Invalid sort option. Avaible filter options are 'asc', 'desc' and 'mixed");
  }
  if (filter ) {
    data = handleFilter(data as ResponseData, filter);
  } 
  if (option === "random") {
    data = handleRandomPost(data);
  } else if (option !== "random" && option !== null) {
    throw new Error("Invalid option. Use 'random' as option.");
  }
  if ("items" in data && count !== null && count < data.items.length) {
    data.items = data.items.slice(0, count);
    data.itemsLength = data.items.length;
  }
  return data as ResponseData | ExtractedItem;
}
