import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, catchError, of } from 'rxjs';

export interface SpotifyStatus {
  song: string;
  artist: string;
  album_art_url: string;
  track_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyToastService {
  constructor(private http: HttpClient) {}

  fetchLanyard(): Observable<SpotifyStatus | null> {
    return this.http.get<any>('https://api.lanyard.rest/v1/users/256141285264588801')
    .pipe(
      map((res) => {
        if (!res.success) return null
        if (res.data.spotify && Object.values(res.data.spotify).every(v => v !== null && v !== undefined)) {
          return res.data.spotify
        } else {
          return null
        }
      }),
      catchError(()=>of(null))
    )
  }
}
