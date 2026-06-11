import { Component, DestroyRef, computed, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, required, min, max } from '@angular/forms/signals';
import { Track } from '../models/track';
import { TrackService } from '../services/track.services';

@Component({
  selector: 'app-track-form',
  imports: [FormField],
  templateUrl: './track-form.html',
  styleUrl: './track-form.css',
})
export class TrackForm {
  id = input(undefined, { transform: numberAttribute });

  private router = inject(Router);
  private trackService = inject(TrackService);
  private destroyRef = inject(DestroyRef);

isEdit = computed(() => this.id() !== undefined && !Number.isNaN(this.id()));
isSubmitting = signal(false);

model = signal({ title: '', artist: '', rating: 5 });

trackForm = form(this.model, (path) => {
    required(path.title, { message: 'Le titre est requis' });
    required(path.artist, { message: "L'artiste est requis" });
    min(path.rating, 0);
    max(path.rating, 10);
  });

  constructor() {
    effect(() => {
      const id = this.id();
      if (id === undefined || Number.isNaN(id)) return;

      this.trackService
        .getTrack(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((track) => {
          this.model.set({
            title: track.title,
            artist: track.artist,
            rating: track.rating,
          });
        });
    });
  }

onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.trackForm().valid() || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const { title, artist, rating } = this.model();

    if (this.isEdit()) {
      const changes: Partial<Track> = { title, artist, rating };
      this.trackService
        .update(this.id()!, changes)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.router.navigate(['/tracks', this.id()]),
          error: () => this.isSubmitting.set(false),
        });
    } else {
      const seed = Date.now();
      const payload: Omit<Track, 'id'> = {
        title,
        artist,
        album: '',
        genre: '',
        durationSeconds: 0,
        year: new Date().getFullYear(),
        rating,
        favorite: false,
        coverUrl: `https://picsum.photos/seed/Q7v3K9-${seed}/300`,
      };
      this.trackService
        .create(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.router.navigate(['/tracks']),
          error: () => this.isSubmitting.set(false),
        });
    }
  }
}
