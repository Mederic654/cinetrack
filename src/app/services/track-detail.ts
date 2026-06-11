import { Component, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TrackService } from './track.services';
import { AuthService } from './auth.services';

@Component({
  selector: 'app-track-detail',
  imports: [RouterLink],
  templateUrl: './track-detail.html',
  styleUrl: './track-detail.css',
})
export class TrackDetail {
  id = input.required({ transform: numberAttribute });

  private service = inject(TrackService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  protected auth = inject(AuthService);

  protected track = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.service.getTrack(id))),
  );

  protected onDelete(): void {
    if (!confirm('Supprimer définitivement ce morceau ?')) return;

    this.service
      .remove(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/tracks']));
  }
}
