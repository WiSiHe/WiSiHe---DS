import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { from } from "rxjs";
import { SanityService } from "../../services/sanity.service";


@Component({
  selector: 'app-projects-index',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="px-4 py-8 max-w-7xl mx-auto">
      <div class="mb-10">
        <h1 class="text-4xl font-bold mb-4">Projects</h1>
        <p class="text-foreground-subtle text-lg max-w-3xl">Explore my collection of projects.</p>
      </div>

      @if (projects()?.data; as data) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (project of data; track project._id) {
            <a [routerLink]="['/projects', project.slug]" class="group block overflow-hidden rounded-xl bg-surface border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div class="aspect-square w-full relative overflow-hidden bg-surface-muted">
                @if (project.image) {
                  <img [src]="sanityService.urlFor(project.image).width(600).height(600).url()" [alt]="project.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                } @else {
                  <div class="w-full h-full text-foreground-subtle flex items-center justify-center p-8 bg-surface-hover/20 font-bold border-b border-border">
                    [Image: {{ project.title }}]
                  </div>
                }
              </div>
              <div class="p-4">
                <h3 class="font-bold text-lg mb-1 truncate text-foreground">{{ project.title }}</h3>
              </div>
            </a>
          }
        </div>
      } @else {
        <div class="p-8 text-center text-foreground-subtle animate-pulse">Loading projects...</div>
      }
    </div>
  `,
})

export default class ProjectsIndex {
    public sanityService = inject(SanityService);   
    
    projects = toSignal(from(this.sanityService.getProjects(1, 12)));
}
