import { Component, computed, inject, input, output } from '@angular/core';
import { Track } from '../models/track';

import { DurationFormatPipe } from '../pipes/duration-format-pipe';
import { HighlightFavorite } from '../directives/highlight-favorite';
import { FavoritesService } from '../services/favorites.services';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-track-card',
  templateUrl: './track-card.html',
  styleUrls: ['./track-card.css'],
  imports: [DurationFormatPipe, HighlightFavorite],
})
export class TrackCard {
  track = input.required<Track>();
  active = input(false);
  select = output<Track>();

  private favorites = inject(FavoritesService);
  protected auth = inject(AuthService);

  protected isFavorite = computed(() => this.favorites.isFavorite(this.track().id));

  protected toggleFavorite(event: Event): void {
    event.stopPropagation();
    if (!this.auth.isLoggedIn()) return;
    this.favorites.toggle(this.track()).subscribe();
  }
}
