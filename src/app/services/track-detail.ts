// track-detail.ts
import { Component, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TrackService } from './track.services';

@Component({
  selector: 'app-track-detail',
  templateUrl: './track-detail.html',
})
export class TrackDetail {
  id = input.required({ transform: numberAttribute });
  private service = inject(TrackService);

  protected track = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.service.getTrack(id))),
  );
}