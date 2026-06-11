import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FavoritesService } from '../services/favorites.services';
import { TrackList } from '../track-list/track-list';

@Component({
  selector: 'app-favorites-page',
  imports: [TrackList],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.css',
})
export class FavoritesPage {
  private favorites = inject(FavoritesService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  protected isLoading = signal(true);
  protected tracks = computed(() => this.favorites.favorites());
  protected error = computed(() => this.favorites.error());

  constructor() {
    this.favorites
      .load()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isLoading.set(false));
  }

  protected openTrack(id: number): void {
    this.router.navigate(['/tracks', id]);
  }
}
