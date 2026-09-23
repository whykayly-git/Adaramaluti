export function unsplash(photoId: string, width = 1200, height = 1500): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&q=80&auto=format&fit=crop`;
}
