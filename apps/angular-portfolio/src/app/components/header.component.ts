import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { navigationItems } from '@wisihe/constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="pointer-events-none fixed top-4 left-4 right-4 z-20 flex items-start justify-between">
      <div class="pointer-events-auto">
        <a
          routerLink="/"
          aria-label="Navigate to the homepage"
          class="group relative flex items-center justify-center p-2 rounded-lg bg-surface border border-border shadow-lg transition-all duration-200 hover:border-accent-border hover:bg-surface-hover hover:scale-105"
        >
          <svg class="transition-all duration-300 text-foreground group-hover:text-accent w-12 h-12 md:w-20 md:h-20" color="currentColor" viewBox="0 0 100 100" fill="currentColor">
            <!-- Simplified Logo Placeholder -->
            <path d="M50 10 L90 90 L10 90 Z" />
          </svg>
        </a>
      </div>

      <div class="flex items-center gap-1 md:gap-2 pointer-events-auto">
        <ul
          class="flex items-center text-foreground bg-surface border border-border overflow-clip rounded-full shadow-lg"
          style="isolation: isolate;"
        >
          @for (item of navItems; track item.href) {
            <li class="first:rounded-l-full first:rounded-r-none last:rounded-r-full last:rounded-l-none p-1">
              <a
                [routerLink]="item.href"
                routerLinkActive="bg-accent text-accent-contrast border-accent-border shadow-sm backdrop-blur-sm"
                [routerLinkActiveOptions]="{ exact: false }"
                class="transition-all gap-1 md:gap-2 flex items-center ease-in-out duration-300 text-xs md:text-base rounded-full border active:scale-95 justify-center px-3 py-2.5 md:px-4 md:py-2 min-w-10 md:min-w-0 text-foreground-subtle bg-transparent border-transparent hover:bg-surface-hover hover:text-accent hover:border-border"
                [attr.aria-label]="'Navigate to ' + item.label"
              >
                <strong class="hidden md:block not-sr-only">{{ item.label }}</strong>
              </a>
            </li>
          }
        </ul>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  navItems = navigationItems;
}
