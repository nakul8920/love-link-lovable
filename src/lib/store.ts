import { WishPage } from "@/types/wish";

const STORAGE_KEY = "wishlink_pages";

const loadPages = (): Map<string, WishPage> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const arr: WishPage[] = JSON.parse(data);
      return new Map(arr.map((p) => [p.slug, p]));
    }
  } catch {}
  return new Map();
};

const persistPages = (pages: Map<string, WishPage>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(pages.values())));
};

let pages = loadPages();

export const savePage = (page: WishPage) => {
  pages.set(page.slug, page);
  persistPages(pages);
};

export const getPage = (slug: string): WishPage | undefined => {
  // Reload from storage in case another tab saved
  pages = loadPages();
  return pages.get(slug);
};

export const getAllPages = (): WishPage[] => {
  pages = loadPages();
  return Array.from(pages.values());
};

export const deletePage = (slug: string) => {
  pages.delete(slug);
  persistPages(pages);
};
