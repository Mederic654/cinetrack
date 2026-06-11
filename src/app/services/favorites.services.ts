import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Track } from '../models/track';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/favorites`;

  private favoritesSignal = signal<Track[]>([]);
  private errorSignal = signal<string | null>(null);

  readonly favorites = computed(() => this.favoritesSignal());
  readonly favoriteIds = computed(() => new Set(this.favoritesSignal().map((t) => t.id)));
  readonly error = computed(() => this.errorSignal());

  isFavorite(id: number): boolean {
    return this.favoriteIds().has(id);
  }

  load() {
    return this.http.get<Track[]>(this.baseUrl).pipe(
      tap((tracks) => {
        this.favoritesSignal.set(tracks);
        this.errorSignal.set(null);
      }),
      catchError((err) => {
        console.error('[FavoritesService] load failed', err);
        this.errorSignal.set('Impossible de charger les favoris.');
        return of([] as Track[]);
      }),
    );
  }

  add(track: Track) {
    const previous = this.favoritesSignal();
    if (previous.some((t) => t.id === track.id)) return of(track);

    this.favoritesSignal.set([...previous, { ...track, favorite: true }]);

    return this.http.post<Track>(`${this.baseUrl}/${track.id}`, {}).pipe(
      catchError((err) => {
        console.error('[FavoritesService] add failed', err);
        this.favoritesSignal.set(previous);
        this.errorSignal.set("Impossible d'ajouter ce morceau aux favoris.");
        return of(null);
      }),
    );
  }

  remove(trackId: number) {
    const previous = this.favoritesSignal();
    this.favoritesSignal.set(previous.filter((t) => t.id !== trackId));

    return this.http.delete<void>(`${this.baseUrl}/${trackId}`).pipe(
      catchError((err) => {
        console.error('[FavoritesService] remove failed', err);
        this.favoritesSignal.set(previous);
        this.errorSignal.set('Impossible de retirer ce morceau des favoris.');
        return of(null);
      }),
    );
  }

  toggle(track: Track): Observable<unknown> {
    return this.isFavorite(track.id)
      ? this.remove(track.id).pipe(map(() => null))
      : this.add(track).pipe(map(() => null));
  }
}
