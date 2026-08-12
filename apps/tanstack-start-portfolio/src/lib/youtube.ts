export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0] || null;
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.includes('/shorts/')) {
        return u.pathname.split('/shorts/')[1]?.split('?')[0] || null;
      }
      return u.searchParams.get('v');
    }
    return null;
  } catch {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = match?.[2];
    return id && id.length >= 11 ? id : null;
  }
}
