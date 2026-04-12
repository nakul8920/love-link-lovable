/**
 * Build the public origin the *browser* should use for /uploads/* (same tab that loaded the SPA).
 * When Vercel proxies /api to Railway, middleware must send X-Forwarded-Host / X-Forwarded-Proto.
 */
function getPublicAssetBase(req) {
  const forwardedHost = (req.get('x-forwarded-host') || '').split(',')[0].trim();
  const forwardedProto = (req.get('x-forwarded-proto') || 'https').split(',')[0].trim();
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, '');
  }

  const envBase = (process.env.PUBLIC_ASSET_BASE_URL || process.env.FRONTEND_URL || process.env.CLIENT_URL || '')
    .trim()
    .replace(/\/$/, '');
  if (envBase) {
    if (envBase.startsWith('http://') || envBase.startsWith('https://')) return envBase;
    return `https://${envBase}`;
  }

  const proto = (req.get('x-forwarded-proto') || req.protocol || 'https').split(',')[0].trim();
  const host = req.get('host');
  if (!host) return '';
  return `${proto}://${host}`.replace(/\/$/, '');
}

function rewriteUploadUrl(url, base) {
  if (typeof url !== 'string' || !url.trim() || !base) return url;
  const b = base.replace(/\/$/, '');
  const u = url.trim();
  const idx = u.indexOf('/uploads/');
  if (idx !== -1) {
    return `${b}${u.slice(idx)}`;
  }
  if (u.startsWith('uploads/')) {
    return `${b}/${u}`;
  }
  return u;
}

function normalizePageForResponse(pageDoc, base) {
  if (!base) {
    return pageDoc.toObject ? pageDoc.toObject() : pageDoc;
  }
  const o = pageDoc.toObject ? pageDoc.toObject() : { ...pageDoc };

  if (Array.isArray(o.images)) {
    o.images = o.images.map((u) => rewriteUploadUrl(u, base));
  }

  if (o.content && typeof o.content === 'object') {
    o.content = { ...o.content };
    if (Array.isArray(o.content.imageUrls)) {
      o.content.imageUrls = o.content.imageUrls.map((u) => rewriteUploadUrl(u, base));
    }
    const sd = o.content.surpriseDetails;
    if (sd && typeof sd === 'object' && Array.isArray(sd.sections)) {
      o.content.surpriseDetails = {
        ...sd,
        sections: sd.sections.map((s) => ({
          ...s,
          images: Array.isArray(s.images) ? s.images.map((u) => rewriteUploadUrl(u, base)) : s.images,
        })),
      };
    }
  }

  return o;
}

module.exports = {
  getPublicAssetBase,
  rewriteUploadUrl,
  normalizePageForResponse,
};
