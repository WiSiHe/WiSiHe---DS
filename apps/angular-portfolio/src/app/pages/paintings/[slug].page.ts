import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { SanityService } from '../../services/sanity.service';

@Component({
  selector: 'app-painting-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="px-4 py-8 max-w-7xl mx-auto pt-32">
      <a routerLink="/paintings" class="inline-flex items-center text-accent hover:text-accent-contrast mb-8 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="m15 18-6-6 6-6"/></svg>
        Back to Gallery
      </a>

      @if (painting(); as p) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Image Section -->
          <div class="relative bg-surface rounded-xl border border-border overflow-hidden shadow-lg aspect-auto flex items-center justify-center p-4">
            @if (p.image) {
              <img [src]="sanityService.urlFor(p.image).width(1200).url()" [alt]="p.title" class="max-w-full max-h-[80vh] object-contain rounded-lg" />
            } @else {
              <div class="w-full h-96 flex bg-surface-muted items-center justify-center text-foreground-subtle border border-dashed border-border rounded-lg">
                [Image: {{ p.title }}]
              </div>
            }
          </div>

          <!-- Details Section -->
          <div class="flex flex-col space-y-6">
            <div>
              <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">{{ p.title }}</h1>
              
              <div class="flex flex-wrap gap-2 mb-6">
                 @for (tag of p.tagsV2; track tag.name) {
                   <span class="px-3 py-1 bg-surface-hover text-foreground-subtle text-sm rounded-full border border-border">
                     {{ tag.name }}
                   </span>
                 }
              </div>
            </div>

            @if (p.description) {
              <div class="prose prose-invert max-w-none text-foreground-subtle leading-relaxed" [innerHTML]="p.description"></div>
            }

            <div class="grid grid-cols-2 gap-4 pt-6 border-t border-border mt-auto">
              @if (p.paintedAt) {
                <div>
                  <p class="text-xs text-foreground-muted uppercase tracking-wider mb-1">Painted</p>
                  <p class="font-medium text-foreground">{{ p.paintedAt | date:'mediumDate' }}</p>
                </div>
              }
              
              @if (p.viewsCount !== undefined) {
                <div>
                  <p class="text-xs text-foreground-muted uppercase tracking-wider mb-1">Views</p>
                  <p class="font-medium text-foreground">{{ p.viewsCount }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="w-full py-20 flex flex-col items-center justify-center text-foreground-subtle animate-pulse space-y-4">
          <div class="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin"></div>
          <p>Loading painting details...</p>
        </div>
      }
    </div>
  `,
})
export default class PaintingDetailPage {
  private route = inject(ActivatedRoute);
  public sanityService = inject(SanityService); // Note: public so the template can reference urlFor()

  // Extract the slug from the URL, then switchMap it into a rigorous Sanity document fetch!
  painting = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => from(this.sanityService.getPainting(params.get('slug') || '')))
    )
  );
}
