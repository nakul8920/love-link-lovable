import { API_BASE_URL } from "@/config";
import type { SurpriseDetails } from "@/types/wish";

/**
 * Stored pages may contain image URLs pointing at an old host (e.g. localhost
 * from dev, or a previous deploy). Extract `/uploads/...` and prefix the
 * active API base so links and images work on every device.
 */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (url == null || typeof url !== "string") return "";
  let u = url.trim();
  if (!u) return "";
  if (u.startsWith("blob:") || u.startsWith("data:")) return u;

  // DB sometimes stores without leading slash
  if (u.startsWith("uploads/")) u = `/${u}`;

  const uploadsIdx = u.indexOf("/uploads/");
  if (uploadsIdx !== -1) {
    const pathAndQuery = u.slice(uploadsIdx);
    const base = API_BASE_URL.replace(/\/$/, "");
    // Production same-origin (Vercel → proxied /uploads): relative path avoids wrong host.
    if (!base) return pathAndQuery;
    return `${base}${pathAndQuery}`;
  }

  return u;
}

export function resolveMediaUrls(urls: string[] | undefined | null): string[] {
  if (!urls || !Array.isArray(urls)) return [];
  return urls.map((x) => resolveMediaUrl(x));
}

export function resolveSurpriseDetailsMedia(details: SurpriseDetails | undefined): SurpriseDetails | undefined {
  if (!details?.sections?.length) return details;
  return {
    ...details,
    sections: details.sections.map((s) => ({
      ...s,
      images: s.images?.length ? s.images.map((img) => resolveMediaUrl(img)) : s.images,
    })),
  };
}
