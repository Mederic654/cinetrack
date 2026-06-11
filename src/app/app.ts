import { Component, effect, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.services';
import { FavoritesService } from './services/favorites.services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected auth = inject(AuthService);
  private favorites = inject(FavoritesService);

  constructor() {
    this.favorites.load().subscribe();

    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.favorites.load().subscribe();
      }
    });
  }
}
