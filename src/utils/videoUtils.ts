/**
 * Video helper utilities for YouTube, Facebook Reel, and HTML5 video streaming.
 */

export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  // Match standard watch, short URL (youtu.be), embed, shorts, and live
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  return /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(url) || !!getYouTubeVideoId(url);
};

export const getYouTubeEmbedUrl = (url: string, autoplay: boolean = false): string => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return url;
  const autoplayParam = autoplay ? '1' : '0';
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplayParam}&rel=0&modestbranding=1&playsinline=1`;
};

export const getYouTubeThumbnail = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export const isFacebookUrl = (url: string): boolean => {
  if (!url) return false;
  return /facebook\.com\//i.test(url);
};
