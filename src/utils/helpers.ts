// Helper function to handle random option
export function handleRandomOption(
  data: ResponseData,
  filter: string
): ExtractedItem {
  let randomPost = getRandomItem(data.items);
  if (filter === "image") {
    const filteredItems = filterItemsWithImages(data.items);
    randomPost = getRandomItem(filteredItems);
  }
  return randomPost;
}

// Helper function to handle sort option
export function handleSortOption(
  data: ResponseData,
  sort: string
): ResponseData {
  data.items = sortItemsByDate(data.items, sort);
  return data;
}

// Helper function to handle image filter
export function handleImageFilter(data: ResponseData): ResponseData {
  data.items = filterItemsWithImages(data.items);
  data.itemsLength = data.items.length;
  return data;
}

// Helper function to get a random item from an array
export function getRandomItem(items: any[]) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

// Helper function to filter items with images
export function filterItemsWithImages(items: any[]) {
  return items.filter(
    (item: any) => item.images !== undefined && item.images.length > 0
  );
}

// Helper function to sort items by date
export function sortItemsByDate(items: any[], sort: string) {
  return items.sort((a: any, b: any) => {
    if (sort === "asc" || sort === undefined) {
      return a.isoDate > b.isoDate ? 1 : -1;
    } else {
      // sort === "desc"
      return a.isoDate < b.isoDate ? 1 : -1;
    }
  });
}
