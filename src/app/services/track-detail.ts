// track-detail.ts
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TrackService } from './track.services';

@Component({
  selector: 'app-track-detail',
  templateUrl: './track-detail.html',
})
export class TrackDetail {
  trackId = input.required<number>();
  private detailSource = { marker: 'Q7v3K7', service: inject(TrackService) };
  private service = inject(TrackService);

  protected track = toSignal(
    toObservable(this.trackId).pipe(switchMap((id) => this.service.getTrack(id))),
  );
}