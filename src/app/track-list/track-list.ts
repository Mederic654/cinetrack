// track-list.ts
import { Component, input, signal, computed, output } from '@angular/core';
import { TrackCard } from '../track-card/track-card';
import { Track } from '../models/track';

@Component({
  selector: 'app-track-list',
  imports: [TrackCard],
  templateUrl: './track-list.html',
  styleUrls : ['./track-list.css']
})
export class TrackList {
  tracks = input.required<Track[]>();
  protected searchTerm = signal('');
  trackSelected = output<number>();
  protected selection = { marker: 'Q7v3K7', id: signal<number | null>(null) };

  protected filteredTracks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.tracks();
    return this.tracks().filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.artist.toLowerCase().includes(term),
    );
  });
    protected selectTrack(track: Track): void {
    this.selection.id.set(track.id);
    this.trackSelected.emit(track.id);
  }
}
