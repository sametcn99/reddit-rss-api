type Feed = {
  title: string;
  lastBuildDate: Date;
  link: string;
  feedUrl: string;
  items: FeedItem[];
};

type FeedItem = {
  id: string;
  title: string;
  link: string;
  pubDate: Date;
  author: string;
  content: string;
  contentSnippet: string;
  isoDate: Date;
};

type ExtractedItem = {
  title: string;
  link: string;
  author: string;
  isoDate: Date;
  id: string;
  links: string[];
  images: string[];
};

type ResponseData = {
  feed?: Feed;
  title: string;
  lastBuildDate: Date;
  link: string;
  feedUrl: string;
  items: ExtractedItem[];
};
