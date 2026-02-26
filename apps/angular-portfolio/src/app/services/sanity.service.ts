import { Injectable } from '@angular/core';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { getPaginatedPaintings, getPaintingsCount, paintingQuery, projectQuery, getPaginatedProjects, getProjectsCount } from '@wisihe/sanity-queries';

@Injectable({
  providedIn: 'root'
})
export class SanityService {
  private client = createClient({
    projectId: import.meta.env['VITE_SANITY_PROJECT_ID'],
    dataset: import.meta.env['VITE_SANITY_DATASET'],
    apiVersion: import.meta.env['VITE_SANITY_API_VERSION'],
    useCdn: true,
    perspective: 'published',
  });

  private builder = imageUrlBuilder(this.client);

  urlFor(source: any) {
    return this.builder.image(source);
  }

  async getPaintings(page: number = 1, limit: number = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const [data, totalCount] = await Promise.all([
      this.client.fetch(getPaginatedPaintings, { start, end }),
      this.client.fetch(getPaintingsCount)
    ]);
    
    return {
      data,
      totalCount,
      totalPages: Math.ceil((totalCount as number) / limit),
      currentPage: page
    };
  }

  async getPainting(slug: string) {
    return this.client.fetch(paintingQuery, { slug });
  }

  async getProjects(page: number = 1, limit: number = 12) {
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const [data, totalCount] = await Promise.all([
      this.client.fetch(getPaginatedProjects, { start, end }),
      this.client.fetch(getProjectsCount)
    ]);
    
    return {
      data,
      totalCount,
      totalPages: Math.ceil((totalCount as number) / limit),
      currentPage: page
    };
  }

  async getProject(slug: string) {
    return this.client.fetch(projectQuery, { slug });
  }
}
