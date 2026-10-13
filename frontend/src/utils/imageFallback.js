
export const DEFAULT_SERVICE_IMAGE =
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

export const DEFAULT_AVATAR_IMAGE =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

export const SVG_SERVICE_FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="100%" height="100%" fill="%231e293b"/><g fill="none" stroke="%233b82f6" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><path d="M400 150 v100 m-50 -50 h100"/><circle cx="400" cy="200" r="100"/></g><text x="50%" y="380" font-family="sans-serif" font-size="28" font-weight="bold" fill="%2394a3b8" text-anchor="middle">LocalMate Verified Service</text></svg>';

export const SVG_AVATAR_FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="%23334155"/><circle cx="100" cy="80" r="40" fill="%2394a3b8"/><path d="M30 180 c0 -35 30 -60 70 -60 s70 25 70 60" fill="%2394a3b8"/></svg>';

export const handleImageError = (e, type = 'service') => {
  const target = e.currentTarget || e.target;
  if (!target) return;

  const fallback = type === 'avatar' ? DEFAULT_AVATAR_IMAGE : DEFAULT_SERVICE_IMAGE;
  const svgFallback = type === 'avatar' ? SVG_AVATAR_FALLBACK : SVG_SERVICE_FALLBACK;

  if (target.src === fallback) {
    target.src = svgFallback;
  } else if (target.src !== svgFallback) {
    target.src = fallback;
  }
};
