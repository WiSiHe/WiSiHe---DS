import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <main class="page-container p-4 flex flex-col items-center justify-center min-h-[50vh]">
      <h1 class="text-6xl font-bold mb-4">404</h1>
      <p class="text-xl">Page not found</p>
      <a href="/" class="mt-8 text-blue-500 hover:underline">Return to Home</a>
    </main>
  `,
})
export default class NotFoundComponent {}
