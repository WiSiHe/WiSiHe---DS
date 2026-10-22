/** Coarse page category attached to every `$pageview`, for dashboards that group by page type. */
export function getPageType(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/projects') return 'projects_listing';
  if (pathname.startsWith('/projects/')) return 'project_detail';
  if (pathname === '/paintings') return 'paintings_listing';
  if (pathname.startsWith('/paintings/')) return 'painting_detail';
  if (pathname === '/about') return 'about';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/privacy') return 'privacy';
  if (pathname.startsWith('/videos/')) return 'video_detail';
  if (pathname === '/photography') return 'photography_listing';
  if (pathname.startsWith('/photography/')) return 'photography_detail';
  if (pathname === '/recipes') return 'recipes_listing';
  if (pathname.startsWith('/recipes/')) return 'recipe_detail';
  if (pathname.startsWith('/three-d')) return 'three_d';
  return 'other';
}
